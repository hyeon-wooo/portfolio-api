import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectEntity } from './project.entity';
import { ProjectContentEntity } from './project-content/project-content.entity';
import { ProjectContentService } from './project-content/project-content.service';
import { ProjectImageEntity } from './project-image/project-image.entity';
import { ProjectImageService } from './project-image/project-image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectContentEntity,
      ProjectImageEntity,
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectContentService, ProjectImageService],
  exports: [ProjectService],
})
export class ProjectModule {}
