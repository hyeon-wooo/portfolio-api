import { Injectable } from '@nestjs/common';
import { DefaultRepository } from 'src/shared/default/default.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillContentOrmEntity } from './skill-content.entity.orm';
import { SkillContent } from 'src/skill/domain/skill-content/skill-content.entity';

@Injectable()
export class SkillContentRepository extends DefaultRepository<
  SkillContent,
  SkillContentOrmEntity
> {
  constructor(
    @InjectRepository(SkillContentOrmEntity)
    private readonly repo: Repository<SkillContentOrmEntity>,
  ) {
    super(repo);
  }

  toOrmEntity(domainEntity: SkillContent): SkillContentOrmEntity {
    const ormEntity = new SkillContentOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.skillId = domainEntity.skillId;
    ormEntity.content = domainEntity.content;
    ormEntity.sequence = domainEntity.sequence;
    return ormEntity;
  }

  toDomain(ormEntity: SkillContentOrmEntity): SkillContent {
    return new SkillContent({
      id: ormEntity.id,
      skillId: ormEntity.skillId,
      content: ormEntity.content,
      sequence: ormEntity.sequence,
    });
  }
}
