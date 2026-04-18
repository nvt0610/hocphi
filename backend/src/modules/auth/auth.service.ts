import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;
    const user = await this.usersService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
  }

  async login(user: any) {
    // Thêm role vào payload để Frontend/Guard có thể dùng mà không cần query lại DB
    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role 
    };
    
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }
}
