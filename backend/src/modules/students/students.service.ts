import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { Enrollment } from '../../entities/enrollment.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiQueryDto } from '../../common/dto/api-query.dto';
import { QueryHelper } from '../../common/utils/query.helper';
import { PaginationUtil } from '../../common/utils/pagination.util';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const { classIds, ...studentData } = createStudentDto;
    const student = this.studentRepository.create(studentData);
    const savedStudent = await this.studentRepository.save(student);

    if (classIds && classIds.length > 0) {
      const enrollments = this.enrollmentRepository.create(
        classIds.map((classId) => ({
          studentId: savedStudent.id,
          classId: classId,
          status: 'ACTIVE',
        })),
      );
      await this.enrollmentRepository.save(enrollments);
    }

    return savedStudent;
  }

  async findAll(query: ApiQueryDto): Promise<ApiResponse<any[]>> {
    const queryBuilder = this.studentRepository.createQueryBuilder('student');

    QueryHelper.apply(queryBuilder, query, {
      searchableFields: ['fullName', 'phoneNumber'],
      defaultRelations: ['enrollments'],
    });

    const [students, total] = await queryBuilder.getManyAndCount();
    
    const data = students.map(student => {
      const plainStudent = JSON.parse(JSON.stringify(student));
      return {
        ...plainStudent,
        enrollmentCount: plainStudent.enrollments?.length || 0,
        enrollments: undefined 
      };
    });

    return {
      success: true,
      message: 'Lấy danh sách học sinh thành công',
      ...PaginationUtil.paginate(data, total, query.page, query.limit),
      timestamp: new Date().toISOString(),
    };
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ 
      where: { id },
      relations: ['enrollments']
    });
    if (!student) {
      throw new NotFoundException(`Không tìm thấy học sinh với ID: ${id}`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const { classIds, ...studentData } = updateStudentDto;
    const student = await this.findOne(id);
    this.studentRepository.merge(student, studentData);
    const updatedStudent = await this.studentRepository.save(student);

    if (classIds !== undefined) {
      // 1. Remove old enrollments (simplification: delete all and re-create, or sync properly)
      // For now, let's just create new ones that don't exist
      const existingEnrollments = await this.enrollmentRepository.find({ where: { studentId: id } });
      const existingClassIds = existingEnrollments.map(e => e.classId);

      // Classes to add
      const toAdd = classIds.filter(cid => !existingClassIds.includes(cid));
      // Classes to remove (optional, usually when editing student you might want to remove them from classes?)
      const toRemove = existingClassIds.filter(cid => !classIds.includes(cid));

      if (toRemove.length > 0) {
        await this.enrollmentRepository.delete({ studentId: id, classId: In(toRemove) });
      }

      if (toAdd.length > 0) {
        const newEnrollments = this.enrollmentRepository.create(
          toAdd.map((cid) => ({
            studentId: id,
            classId: cid,
            status: 'ACTIVE',
          })),
        );
        await this.enrollmentRepository.save(newEnrollments);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy học sinh với ID: ${id}`);
    }
  }
}
