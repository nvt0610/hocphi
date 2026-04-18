import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQueryDto } from '../../common/dto/api-query.dto';
import { QueryHelper } from '../../common/utils/query.helper';
import { PaginationUtil } from '../../common/utils/pagination.util';
import { ApiResponse } from '../../common/interfaces/response.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    // 1. Kiểm tra tồn tại
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username đã tồn tại');
    }

    // 2. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Lưu user mới
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Trả về user nhưng bỏ qua mật khẩu
    const { password: _, ...result } = savedUser;
    return result as User;
  }

  async findAll(query: ApiQueryDto): Promise<ApiResponse<User[]>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    queryBuilder.select([
      'user.id',
      'user.username',
      'user.fullName',
      'user.role',
      'user.createdAt',
      'user.updatedAt'
    ]);

    QueryHelper.apply(queryBuilder, query, {
      searchableFields: ['username', 'fullName'],
    });

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      message: 'Lấy danh sách người dùng thành công',
      ...PaginationUtil.paginate(users, total, query.page, query.limit),
      timestamp: new Date().toISOString(),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'fullName', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
    }

    return user;
  }

  // Hàm helper cho Login (cần mật khẩu)
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Kiểm tra tồn tại

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    const { password: _, ...result } = updatedUser;
    return result as User;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
    }
  }
}
