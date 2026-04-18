import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../../entities/enrollment.entity';
import { TuitionRecord } from '../../entities/tuition-record.entity';
import { Class } from '../../entities/class.entity';

@Injectable()
export class AutomationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(TuitionRecord)
    private tuitionRepo: Repository<TuitionRecord>,
    @InjectRepository(Class)
    private classRepo: Repository<Class>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Tuition Automation Service started. Running initial check...');
    await this.generateMonthlyTuition();
  }

  // Run at 00:00 on the 1st day of every month
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleMonthlyCron() {
    this.logger.log('Running scheduled monthly tuition generation...');
    await this.generateMonthlyTuition();
  }

  async generateMonthlyTuition() {
    const now = new Date();
    const billingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = `tháng ${now.getMonth() + 1}/${now.getFullYear()}`;

    try {
      // Find all active enrollments with their class information
      const activeEnrollments = await this.enrollmentRepo.find({
        where: { status: 'ACTIVE' },
        relations: ['class', 'student'],
      });

      this.logger.log(`Checking tuition for ${activeEnrollments.length} active enrollments for ${billingMonth}`);

      let createdCount = 0;

      for (const enrollment of activeEnrollments) {
        // Check if a record already exists for this enrollment in this month
        const existing = await this.tuitionRepo.findOne({
          where: {
            enrollmentId: enrollment.id,
            billingMonth: billingMonth,
          },
        });

        if (!existing) {
          const newRecord = this.tuitionRepo.create({
            enrollmentId: enrollment.id,
            studentId: enrollment.studentId,
            amount: enrollment.class.monthlyFee || 0,
            billingMonth: billingMonth,
            content: `Học phí ${monthLabel} - Lớp ${enrollment.class.className}`,
            status: 'Unpaid',
          });

          await this.tuitionRepo.save(newRecord);
          createdCount++;
        }
      }

      this.logger.log(`Generation complete. Created ${createdCount} new tuition records.`);
    } catch (error) {
      this.logger.error('Failed to generate monthly tuition records', error.stack);
    }
  }
}
