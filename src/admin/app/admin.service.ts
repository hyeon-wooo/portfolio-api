import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminRepository } from '../infra/admin.repository';
import { Admin } from '../domain/admin.entity';
import { CreateAdminDto, UpdateAdminDto } from '../interface/admin.dto';
import { EmailAlreadyExistsException } from '../domain/admin.exception';

@Injectable()
export class AdminService {
  constructor(private readonly repo: AdminRepository) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    // 비즈니스 로직(예: 이메일 중복 체크 등) 추가 가능
    const already = await this.repo.findOne({ email: dto.email });
    if (already) throw new EmailAlreadyExistsException(dto.email);
    return this.repo.createOne(dto);
  }

  async findOne(id: number): Promise<Admin | null> {
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
}
