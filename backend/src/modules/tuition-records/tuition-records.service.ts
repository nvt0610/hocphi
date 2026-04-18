import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TuitionRecord, TuitionStatus } from '../../entities/tuition-record.entity';
import { CreateTuitionRecordDto } from './dto/create-tuition-record.dto';
import { TuitionQueryDto } from './dto/tuition-query.dto';
import { Student } from '../../entities/student.entity';
import { QueryHelper } from '../../common/utils/query.helper';
import { PaginationUtil } from '../../common/utils/pagination.util';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Injectable()
export class TuitionRecordsService {
  constructor(
    @InjectRepository(TuitionRecord)
    private readonly tuitionRepository: Repository<TuitionRecord>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createDto: CreateTuitionRecordDto): Promise<TuitionRecord> {
    const { studentId } = createDto;

    // 1. Kiểm tra học sinh tồn tại
    const student = await this.studentRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Không tìm thấy học sinh với ID: ${studentId}`);
    }

    // 2. Tạo record
    const record = (this.tuitionRepository.create(createDto as any) as unknown) as TuitionRecord;
    return this.tuitionRepository.save(record);
  }

  async findAll(query: TuitionQueryDto): Promise<ApiResponse<TuitionRecord[]>> {
    const queryBuilder = this.tuitionRepository.createQueryBuilder('tuition');

    // Luôn join học sinh để lấy thông tin và tìm kiếm
    queryBuilder.leftJoinAndSelect('tuition.student', 'student');

    if (query.search) {
      queryBuilder.andWhere('student.fullName ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('tuition.status = :status', { status: query.status });
    }

    // Áp dụng các bộ lọc khác (pagination, sorting) qua QueryHelper
    QueryHelper.apply(queryBuilder, query, {
      searchableFields: [], 
      defaultRelations: [] 
    });

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      message: 'Lấy danh sách học phí thành công',
      ...PaginationUtil.paginate(data, total, query.page, query.limit),
      timestamp: new Date().toISOString(),
    };
  }

  async findByStudent(studentId: string): Promise<TuitionRecord[]> {
    return this.tuitionRepository.find({
      where: { studentId },
      relations: ['student'],
      order: { paymentDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TuitionRecord> {
    const record = await this.tuitionRepository.findOne({ 
      where: { id },
      relations: ['student'] 
    });
    if (!record) {
      throw new NotFoundException(`Không tìm thấy bản ghi học phí với ID: ${id}`);
    }
    return record;
  }

  async updateStatus(id: string, status: 'Paid' | 'Unpaid'): Promise<TuitionRecord> {
    const record = await this.findOne(id);
    record.status = status;
    if (status === 'Paid' && !record.paymentDate) {
      record.paymentDate = new Date();
    }
    return this.tuitionRepository.save(record);
  }

  async update(id: string, updateDto: any): Promise<TuitionRecord> {
    const record = await this.findOne(id);
    
    // Chỉ cho phép cập nhật nội dung, không cho phép sửa số tiền hay học sinh
    if (updateDto.content !== undefined) {
      record.content = updateDto.content;
    }

    return this.tuitionRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tuitionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy bản kỳ học phí với ID: ${id}`);
    }
  }
}
