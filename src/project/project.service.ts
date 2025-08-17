import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { ProjectImageService } from './project-image/project-image.service';
import { ProjectContentService } from './project-content/project-content.service';
import { CreateProjectBodyDto, UpdateProjectBodyDto } from './project.dto';
import { SkillProjectMapService } from 'src/nm-relation/skill-project/skill-project.service';
import { EProjectContentKind } from './project.enum';

@Injectable()
export class ProjectService extends CRUDService<ProjectEntity> {
  constructor(
    @InjectRepository(ProjectEntity) repo: Repository<ProjectEntity>,
    private projectContentService: ProjectContentService,
    private projectImageService: ProjectImageService,
    private skillProjectService: SkillProjectMapService,
  ) {
    super(repo);
  }

  async create(body: CreateProjectBodyDto) {
    // 프로젝트 추가
    const project = await this.createOne({
      title: body.title,
      part: body.part,
      summary: body.summary,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    await this.appendProjectMetadata(project.id, {
      skillIds: body.skillIds,
      imageIds: body.imageIds,
      content: body.contents,
    });

    return project;
  }

  async update(id: number, body: UpdateProjectBodyDto) {
    await this.updateById(id, {
      title: body.title,
      part: body.part,
      summary: body.summary,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    await this.projectContentService.deleteMany({ projectId: id });
    await this.projectImageService.deleteMany({ projectId: id });
    await this.skillProjectService.deleteMany({ projectId: id });

    await this.appendProjectMetadata(id, {
      skillIds: body.skillIds,
      imageIds: body.imageIds,
      content: body.contents,
    });
  }

  async deleteProject(id: number) {
    await this.projectContentService.deleteMany({ projectId: id });
    await this.projectImageService.deleteMany({ projectId: id });
    await this.skillProjectService.deleteMany({ projectId: id });

    await this.deleteById(id);
  }

  // 프로젝트에 스킬, 첨부사진, 내용 추가
  async appendProjectMetadata(
    projectId: number,
    metadata: {
      skillIds: number[];
      imageIds: number[];
      content: {
        kind: EProjectContentKind;
        content: string;
        children?: string[];
      }[];
    },
  ) {
    // content 추가
    let contentIdx = 0;
    for (const content of metadata.content) {
      const parentContent = await this.projectContentService.createOne({
        content: content.content,
        projectId,
        kind: content.kind,
        sequence: 500 - contentIdx,
      });
      if (content.children)
        this.projectContentService.createMany(
          content.children.map((child, i) => ({
            content: child,
            projectId,
            kind: content.kind,
            parentId: parentContent.id,
            sequence: 500 - i,
          })),
        );

      contentIdx++;
    }

    // 첨부사진 추가
    await this.projectImageService.createMany(
      metadata.imageIds.map((imageId) => ({
        imageId,
        projectId,
      })),
    );

    // 스킬 추가
    await this.skillProjectService.createMany(
      metadata.skillIds.map((skillId) => ({
        skillId,
        projectId,
      })),
    );
  }
}
