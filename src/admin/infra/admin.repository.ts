import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminOrmEntity } from './admin.entity.orm';
import { Admin } from '../domain/admin.entity';
import { IAdminRepository } from '../domain/admin.repository.interface';
import { DefaultRepository } from 'src/shared/default/default.repository';

@Injectable()
export class AdminRepository
  extends DefaultRepository<Admin, AdminOrmEntity>
  implements IAdminRepository
{
  constructor(
    @InjectRepository(AdminOrmEntity)
    ormRepo: Repository<AdminOrmEntity>,
  ) {
    super(ormRepo);
  }

  protected toDomain(entity: AdminOrmEntity): Admin {
    return new Admin(entity);
  }

  protected toOrmEntity(domain: Admin): AdminOrmEntity {
    const orm = new AdminOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.level = domain.level;
    orm.email = domain.email;
    orm.password = domain.password;
    return orm;
  }

  async findByEmailWithPassword(email: string): Promise<Admin | null> {
    const entity = await this.ormRepo.findOne({
      where: { email },
      select: ['id', 'name', 'level', 'email', 'password', 'createdAt'],
    });
    return entity ? this.toDomain(entity) : null;
  }
}
