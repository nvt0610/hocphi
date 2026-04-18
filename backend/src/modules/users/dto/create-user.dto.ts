import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  MaxLength,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Username không được để trống' })
  @MaxLength(50, { message: 'Username không được quá 50 ký tự' })
  username: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có nhất 6 ký tự' })
  password: string;

  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  @IsOptional()
  @MaxLength(100, { message: 'Họ tên không được quá 100 ký tự' })
  fullName?: string;

  @IsString({ message: 'Role phải là chuỗi ký tự' })
  @IsOptional()
  @IsIn(['admin', 'staff'], { message: 'Role chỉ có thể là admin hoặc staff' })
  role?: string;
}
