import { Injectable } from '@nestjs/common';
import { TechCategoryOrmEntity } from './tech-category.entity.orm';
import { DefaultRepository } from 'src/shared/default/default.repository';
import { TechCategory } from '../domain/tech-category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from 'src/file/infra/file.repository';

@Injectable()
export class TechCategoryRepository extends DefaultRepository<
  TechCategory,
  TechCategoryOrmEntity
> {
  constructor(
    @InjectRepository(TechCategoryOrmEntity)
    private readonly repo: Repository<TechCategoryOrmEntity>,
    private readonly fileRepository: FileRepository,
  ) {
    super(repo);
  }

  toOrmEntity(domainEntity: TechCategory): TechCategoryOrmEntity {
    const ormEntity = new TechCategoryOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.sequence = domainEntity.sequence;
    ormEntity.fileId = domainEntity.fileId;
    return ormEntity;
  }

  toDomain(ormEntity: TechCategoryOrmEntity): TechCategory {
    return new TechCategory({
      id: ormEntity.id,
      name: ormEntity.name,
      sequence: ormEntity.sequence,
      fileId: ormEntity.fileId,
      file: ormEntity.file
        ? this.fileRepository.toDomain(ormEntity.file)
        : null,
    });
  }
}
