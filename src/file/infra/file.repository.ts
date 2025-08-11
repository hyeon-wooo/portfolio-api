import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileOrmEntity } from './file.entity.orm';
import { DefaultRepository } from 'src/shared/default/default.repository';
import { File } from '../domain/file.entity';

@Injectable()
export class FileRepository extends DefaultRepository<File, FileOrmEntity> {
  constructor(
    @InjectRepository(FileOrmEntity)
    private readonly repo: Repository<FileOrmEntity>,
  ) {
    super(repo);
  }

  toDomain(ormEntity: FileOrmEntity): File {
    return new File({
      id: ormEntity.id,
      usage: ormEntity.usage,
      originalName: ormEntity.originalName,
      relativePath: ormEntity.relativePath,
      extension: ormEntity.extension,
      size: ormEntity.size,
      mimetype: ormEntity.mimetype,
      active: ormEntity.active,
      url: ormEntity.url,
    });
  }

  toOrmEntity(domainEntity: File): FileOrmEntity {
    const orm = new FileOrmEntity();
    orm.id = domainEntity.id;
    orm.usage = domainEntity.usage;
    orm.originalName = domainEntity.originalName;
    orm.relativePath = domainEntity.relativePath;
    orm.extension = domainEntity.extension;
    orm.size = domainEntity.size;
    orm.mimetype = domainEntity.mimetype;
    orm.active = domainEntity.active;
    return orm;
  }

  findById(id: number) {
    return this.repo
      .findOne({ where: { id } })
      .then((entity) => (entity ? this.toDomain(entity) : null));
  }

  updateActive(id: number, active: boolean) {
    return this.repo.update({ id }, { active });
  }
}
