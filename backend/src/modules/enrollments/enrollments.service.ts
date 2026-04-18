import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from '../../entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Student } from '../../entities/student.entity';
import { Class } from '../../entities/class.entity';
import { ApiQueryDto } from '../../common/dto/api-query.dto';
import { QueryHelper } from '../../common/utils/query.helper';
import { PaginationUtil } from '../../common/utils/pagination.util';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const { studentId, classId } = createEnrollmentDto;

    // 1. Kiểm tra học sinh tồn tại
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Không tìm thấy học sinh với ID: ${studentId}`);
    }

    // 2. Kiểm tra lớp học tồn tại
    const classEntity = await this.classRepository.findOne({ where: { id: classId } });
    if (!classEntity) {
      throw new NotFoundException(`Không tìm thấy lớp học với ID: ${classId}`);
    }

    // 3. Kiểm tra xem đã ghi danh chưa (TypeORM sẽ ném lỗi nếu trùng do Unique constraint, nhưng check trước cho clear message)
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { studentId, classId },
    });
    if (existingEnrollment) {
      throw new ConflictException('Học sinh này đã được ghi danh vào lớp này');
    }

    // 4. Lưu ghi danh
    const enrollment = (this.enrollmentRepository.create(createEnrollmentDto as any) as unknown) as Enrollment;
    const savedEnrollment = await this.enrollmentRepository.save(enrollment);
    
    return this.findOne(savedEnrollment.id);
  }

  async findAll(query: ApiQueryDto): Promise<ApiResponse<Enrollment[]>> {
    const queryBuilder = this.enrollmentRepository.createQueryBuilder('enrollment');

    QueryHelper.apply(queryBuilder, query, {
      searchableFields: ['status'],
      defaultRelations: ['student', 'class']
    });

    const [enrollments, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      message: 'Lấy danh sách đăng ký học thành công',
      ...PaginationUtil.paginate(enrollments, total, query.page, query.limit),
      timestamp: new Date().toISOString(),
    };
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['student', 'class'],
    });
    if (!enrollment) {
      throw new NotFoundException(`Không tìm thấy bản ghi ghi danh với ID: ${id}`);
    }
    return enrollment;
  }

  async updateStatus(id: string, status: EnrollmentStatus): Promise<Enrollment> {
    const enrollment = await this.findOne(id);
    enrollment.status = status;
    return this.enrollmentRepository.save(enrollment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.enrollmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy bản ghi ghi danh với ID: ${id}`);
    }
  }
}
