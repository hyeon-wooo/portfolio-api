import { Injectable } from '@nestjs/common';
import { CreateAdminDto, UpdateAdminDto, LoginAdminDto } from './admin.dto';
import {
  EmailAlreadyExistsException,
  LoginFailedException,
} from './admin.exception';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CRUDService } from 'src/shared/crud.service';
import { AdminEntity } from './admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService extends CRUDService<AdminEntity> {
  constructor(
    @InjectRepository(AdminEntity)
    repo: Repository<AdminEntity>,
  ) {
    super(repo);
  }

  async findByEmailWithPassword(email: string): Promise<AdminEntity | null> {
    const admin = await this.repo.findOne({
      where: { email },
      select: ['id', 'level', 'email', 'password'],
    });
    return admin;
  }

  async validateLogin(dto: LoginAdminDto): Promise<AdminEntity> {
    const admin = await this.findByEmailWithPassword(dto.email);
    if (!admin) throw new LoginFailedException('존재하지 않는 계정입니다.');

    const isMatch = await bcrypt.compare(dto.password, admin.password);
    if (!isMatch) throw new LoginFailedException('존재하지 않는 계정입니다.');

    return admin;
  }
}
