import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { ProjectContentEntity } from './project-content.entity';

@Injectable()
export class ProjectContentService extends CRUDService<ProjectContentEntity> {
  constructor(
    @InjectRepository(ProjectContentEntity)
    repo: Repository<ProjectContentEntity>,
  ) {
    super(repo);
  }
}
