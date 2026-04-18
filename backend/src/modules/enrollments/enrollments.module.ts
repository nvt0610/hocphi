import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { Enrollment } from '../../entities/enrollment.entity';
import { Student } from '../../entities/student.entity';
import { Class } from '../../entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Student, Class])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
