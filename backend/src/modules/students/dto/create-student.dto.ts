import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  @IsEnum(['Nam', 'Nữ', 'Khác'])
  gender?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  classIds?: string[];
}
