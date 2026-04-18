import { IsOptional, IsIn } from 'class-validator';
import { ApiQueryDto } from '../../../common/dto/api-query.dto';

export class TuitionQueryDto extends ApiQueryDto {
  @IsOptional()
  @IsIn(['Paid', 'Unpaid'])
  status?: 'Paid' | 'Unpaid';
}
