import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminRepository } from '../infra/admin.repository';
import { Admin } from '../domain/admin.entity';
import {
  CreateAdminDto,
  UpdateAdminDto,
  LoginAdminDto,
} from '../interface/admin.dto';
import {
  EmailAlreadyExistsException,
  LoginFailedException,
} from '../domain/admin.exception';
import { NotImplementedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private readonly repo: AdminRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    // 비즈니스 로직(예: 이메일 중복 체크 등) 추가 가능
    const already = await this.repo.findOne({ email: dto.email });
    if (already) throw new EmailAlreadyExistsException(dto.email);

    const { password, ...rest } = dto;
    const hash = await bcrypt.hash(
      password,
      Number(this.configService.get('PASSWORD_SALT')),
    );

    return this.repo.createOne({ ...rest, password: hash });
  }

  async findOne(
    condition: Partial<Record<keyof Admin, any>>,
    relations?: Partial<Record<keyof Admin, any>>,
  ): Promise<Admin | null> {
    return this.repo.findOne(condition, relations);
  }

  async findById(id: number): Promise<Admin | null> {
    return this.repo.findOne({ id });
  }

  async findAll(): Promise<Admin[]> {
    return this.repo.findMany();
  }

  async update(id: number, dto: UpdateAdminDto): Promise<Admin> {
    return this.repo.updateById(id, dto);
  }

  async delete(id: number): Promise<void> {
    return this.repo.deleteById(id);
  }

  async validateLogin(dto: LoginAdminDto): Promise<Admin> {
    const admin = await this.repo.findByEmailWithPassword(dto.email);
    if (!admin) throw new LoginFailedException('존재하지 않는 계정입니다.');

    const isMatch = await bcrypt.compare(dto.password, admin.password);
    if (!isMatch) throw new LoginFailedException('존재하지 않는 계정입니다.');

    return admin;
  }
}
