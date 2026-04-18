import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TuitionRecordsService } from './tuition-records.service';
import { TuitionRecordsController } from './tuition-records.controller';
import { TuitionRecord } from '../../entities/tuition-record.entity';
import { Student } from '../../entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TuitionRecord, Student])],
  controllers: [TuitionRecordsController],
  providers: [TuitionRecordsService],
  exports: [TuitionRecordsService],
})
export class TuitionRecordsModule {}
