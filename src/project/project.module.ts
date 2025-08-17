import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectEntity } from './project.entity';
import { ProjectContentEntity } from './project-content/project-content.entity';
import { ProjectContentService } from './project-content/project-content.service';
import { ProjectImageEntity } from './project-image/project-image.entity';
import { ProjectImageService } from './project-image/project-image.service';
import { ProjectLinkEntity } from './project-link/project-link.entity';
import { ProjectLinkService } from './project-link/project-link.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectContentEntity,
      ProjectImageEntity,
      ProjectLinkEntity,
    ]),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectContentService,
    ProjectImageService,
    ProjectLinkService,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
