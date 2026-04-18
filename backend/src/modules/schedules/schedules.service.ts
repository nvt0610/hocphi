import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../../entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ApiQueryDto } from '../../common/dto/api-query.dto';
import { QueryHelper } from '../../common/utils/query.helper';
import { PaginationUtil } from '../../common/utils/pagination.util';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(createScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  async findAll(query: ApiQueryDto): Promise<ApiResponse<Schedule[]>> {
    const queryBuilder = this.scheduleRepository.createQueryBuilder('schedule');

    QueryHelper.apply(queryBuilder, query, {
      searchableFields: ['dayOfWeek'],
      defaultRelations: ['class']
    });

    if (!query.sortBy) {
      queryBuilder.orderBy('schedule.dayOfWeek', 'ASC').addOrderBy('schedule.startTime', 'ASC');
    }

    const [schedules, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      message: 'Lấy danh sách lịch học thành công',
      ...PaginationUtil.paginate(schedules, total, query.page, query.limit),
      timestamp: new Date().toISOString(),
    };
  }

  async findByClass(classId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { classId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['class'],
    });
    if (!schedule) {
      throw new NotFoundException(`Không tìm thấy ca học với ID: ${id}`);
    }
    return schedule;
  }

  async remove(id: string): Promise<void> {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy ca học với ID: ${id}`);
    }
  }
}
