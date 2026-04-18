import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class NotEmptyPipe implements PipeTransform {
  transform(value: any) {
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException('Dữ liệu gửi lên không được để trống');
    }
    return value;
  }
}
