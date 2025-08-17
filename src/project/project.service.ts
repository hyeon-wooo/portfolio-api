import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectService extends CRUDService<ProjectEntity> {
  constructor(
    @InjectRepository(ProjectEntity) repo: Repository<ProjectEntity>,
  ) {
    super(repo);
  }
}
