import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { SkillContentEntity } from './skill-content.entity';

@Injectable()
export class SkillContentService extends CRUDService<SkillContentEntity> {
  constructor(
    @InjectRepository(SkillContentEntity) repo: Repository<SkillContentEntity>,
  ) {
    super(repo);
  }
}
