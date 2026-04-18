import { IsNotEmpty, IsUUID, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID('4', { message: 'ID học sinh không hợp lệ' })
  @IsNotEmpty({ message: 'ID học sinh không được để trống' })
  studentId: string;

  @IsUUID('4', { message: 'ID lớp học không hợp lệ' })
  @IsNotEmpty({ message: 'ID lớp học không được để trống' })
  classId: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'], { message: 'Trạng thái chỉ có thể là ACTIVE hoặc INACTIVE' })
  status?: string;

  @IsDateString({}, { message: 'Ngày nhập học không hợp lệ' })
  @IsOptional()
  joinedAt?: string;
}
