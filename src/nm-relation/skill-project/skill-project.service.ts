import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { SkillProjectMapEntity } from './skill-project.entity';

@Injectable()
export class SkillProjectMapService extends CRUDService<SkillProjectMapEntity> {
  constructor(
    @InjectRepository(SkillProjectMapEntity)
    repo: Repository<SkillProjectMapEntity>,
  ) {
    super(repo);
  }
}
