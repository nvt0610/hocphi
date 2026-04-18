import { IsUUID, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsIn } from 'class-validator';

export class CreateTuitionRecordDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsOptional()
  enrollmentId?: string;

  @IsString()
  @IsOptional()
  billingMonth?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsIn(['Paid', 'Unpaid'])
  status?: string;
}
