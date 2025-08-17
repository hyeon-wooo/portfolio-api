import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { ProjectImageEntity } from './project-image.entity';

@Injectable()
export class ProjectImageService extends CRUDService<ProjectImageEntity> {
  constructor(
    @InjectRepository(ProjectImageEntity) repo: Repository<ProjectImageEntity>,
  ) {
    super(repo);
  }
}
