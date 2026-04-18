import { IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber, IsArray, ValidateNested, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  className: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  monthlyFee?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateClassScheduleDto)
  schedules?: CreateClassScheduleDto[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  studentIds?: string[];
}

export class CreateClassScheduleDto {
  @IsNumber()
  @Min(2)
  @Max(8)
  dayOfWeek: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
  endTime: string;
}
