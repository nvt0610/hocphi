import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../../entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Schedule } from '../../entities/schedule.entity';
import { Enrollment } from '../../entities/enrollment.entity';
import { ApiQueryDto } from '../../common/dto/api-query.dto';
import { QueryHelper } from '../../common/utils/query.helper';
import { PaginationUtil } from '../../common/utils/pagination.util';
import { ApiResponse } from '../../common/interfaces/response.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const { className, schedules, studentIds, ...classData } = createClassDto;

    const existingClass = await this.classRepository.findOne({
      where: { className },
    });
    if (existingClass) {
      throw new ConflictException('Tên lớp học đã tồn tại');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Tạo lớp học
      const newClass = this.classRepository.create({
        className,
        ...classData,
      });
      const savedClass = await queryRunner.manager.save(newClass);

      // 2. Tạo lịch học
      if (schedules && schedules.length > 0) {
        const scheduleEntities = schedules.map((s) =>
          this.scheduleRepository.create({
            ...s,
            classId: savedClass.id,
          }),
        );
        await queryRunner.manager.save(scheduleEntities);
      }

      // 3. Đăng ký học sinh
      if (studentIds && studentIds.length > 0) {
        const enrollmentEntities = studentIds.map((studentId) =>
          this.enrollmentRepository.create({
            studentId,
            classId: savedClass.id,
            status: 'ACTIVE',
          }),
        );
        await queryRunner.manager.save(enrollmentEntities);
      }

      await queryRunner.commitTransaction();
      return savedClass;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: ApiQueryDto): Promise<ApiResponse<any[]>> {
    const queryBuilder = this.classRepository.createQueryBuilder('class');

    const helperOptions = {
      searchableFields: ['className', 'description'],
      defaultRelations: ['schedules', 'enrollments', 'enrollments.student', 'enrollments.student.tuitionRecords'],
    };

    QueryHelper.apply(queryBuilder, query, {
      ...helperOptions,
    });

    const [classes, total] = await queryBuilder.getManyAndCount();

    const data = classes.map((cls) => {
      const plainCls = JSON.parse(JSON.stringify(cls));
      
      const studentCount = plainCls.enrollments?.length || 0;
      const scheduleCount = plainCls.schedules?.length || 0;
      
      const paidCount = plainCls.enrollments?.filter((en) => 
        en.student?.tuitionRecords?.some(tr => tr.status === 'Paid' && tr.enrollmentId === en.id)
      ).length || 0;

      return {
        ...plainCls,
        studentCount,
        scheduleCount,
        paidCount,
      };
    });

    return {
      success: true,
      message: 'Lấy danh sách lớp học thành công',
      ...PaginationUtil.paginate(data, total, query.page, query.limit),
      timestamp: new Date().toISOString(),
    };
  }

  async findOne(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({ 
      where: { id },
      relations: ['schedules', 'enrollments', 'enrollments.student'] 
    });
    if (!classEntity) {
      throw new NotFoundException(`Không tìm thấy lớp học với ID: ${id}`);
    }
    return classEntity;
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const { schedules, studentIds, ...classData } = updateClassDto;
    const classEntity = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Cập nhật thông tin cơ bản
      await queryRunner.manager.save(Class, {
        ...classEntity,
        ...classData,
      });

      // 2. Cập nhật lịch học (Xóa cũ - Thêm mới)
      if (schedules) {
        await queryRunner.manager.delete(Schedule, { classId: id });
        if (schedules.length > 0) {
          const scheduleEntities = schedules.map((s) =>
            this.scheduleRepository.create({
              ...s,
              classId: id,
            }),
          );
          await queryRunner.manager.save(scheduleEntities);
        }
      }

      // 3. Cập nhật danh sách học sinh (Xóa cũ - Thêm mới)
      if (studentIds) {
        await queryRunner.manager.delete(Enrollment, { classId: id });
        if (studentIds.length > 0) {
          const enrollmentEntities = studentIds.map((studentId) =>
            this.enrollmentRepository.create({
              studentId,
              classId: id,
              status: 'ACTIVE',
            }),
          );
          await queryRunner.manager.save(enrollmentEntities);
        }
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy lớp học với ID: ${id}`);
    }
  }
}
