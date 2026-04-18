import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from '../../entities/class.entity';
import { Schedule } from '../../entities/schedule.entity';
import { Enrollment } from '../../entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Schedule, Enrollment])],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
