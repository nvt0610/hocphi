import { IsNotEmpty, IsUUID, IsNumber, Min, Max, IsString, Matches } from 'class-validator';

export class CreateScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsNumber()
  @Min(2)
  @Max(8)
  dayOfWeek: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'startTime must be in HH:mm format' })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'endTime must be in HH:mm format' })
  endTime: string;
}
