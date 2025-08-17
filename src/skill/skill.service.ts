import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { SkillEntity } from './skill.entity';

@Injectable()
export class SkillService extends CRUDService<SkillEntity> {
  constructor(@InjectRepository(SkillEntity) repo: Repository<SkillEntity>) {
    super(repo);
  }
}
