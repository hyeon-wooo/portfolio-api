import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { ProjectLinkEntity } from './project-link.entity';

@Injectable()
export class ProjectLinkService extends CRUDService<ProjectLinkEntity> {
  constructor(
    @InjectRepository(ProjectLinkEntity) repo: Repository<ProjectLinkEntity>,
  ) {
    super(repo);
  }
}
