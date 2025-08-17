import { Injectable } from '@nestjs/common';
import { SkillOrmEntity } from './skill.entity.orm';
import { DefaultRepository } from 'src/shared/default/default.repository';
import { Skill } from '../domain/skill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from 'src/file/infra/file.repository';
import { SkillContentRepository } from './skill-content/skill-content.repository';

@Injectable()
export class SkillRepository extends DefaultRepository<Skill, SkillOrmEntity> {
  constructor(
    @InjectRepository(SkillOrmEntity)
    private readonly repo: Repository<SkillOrmEntity>,
    private readonly fileRepository: FileRepository,
    private readonly skillContentRepository: SkillContentRepository,
  ) {
    super(repo);
  }

  toOrmEntity(domainEntity: Skill): SkillOrmEntity {
    const ormEntity = new SkillOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.sequence = domainEntity.sequence;
    ormEntity.fileId = domainEntity.fileId;
    return ormEntity;
  }

  toDomain(ormEntity: SkillOrmEntity): Skill {
    return new Skill({
      id: ormEntity.id,
      name: ormEntity.name,
      sequence: ormEntity.sequence,
      fileId: ormEntity.fileId,
      file: ormEntity.file
        ? this.fileRepository.toDomain(ormEntity.file)
        : null,
      contents:
        ormEntity.contents
          ?.sort((a, b) => b.sequence - a.sequence)
          .map((content) => content.content) ?? [],
    });
  }
}
