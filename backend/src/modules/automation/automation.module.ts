import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationService } from './automation.service';
import { Enrollment } from '../../entities/enrollment.entity';
import { TuitionRecord } from '../../entities/tuition-record.entity';
import { Class } from '../../entities/class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, TuitionRecord, Class]),
  ],
  providers: [AutomationService],
})
export class AutomationModule {}
