import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { EntityManager, Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { ProjectImageService } from './project-image/project-image.service';
import { ProjectContentService } from './project-content/project-content.service';
import { CreateProjectBodyDto, UpdateProjectBodyDto } from './project.dto';
import { SkillProjectMapService } from 'src/nm-relation/skill-project/skill-project.service';
import { EProjectContentKind } from './project.enum';
import { ProjectLinkService } from './project-link/project-link.service';
import { ProjectContentEntity } from './project-content/project-content.entity';
import { ProjectImageEntity } from './project-image/project-image.entity';
import { SkillProjectMapEntity } from 'src/nm-relation/skill-project/skill-project.entity';
import { ProjectLinkEntity } from './project-link/project-link.entity';

@Injectable()
export class ProjectService extends CRUDService<ProjectEntity> {
  constructor(
    @InjectRepository(ProjectEntity) repo: Repository<ProjectEntity>,
    private projectContentService: ProjectContentService,
    private projectImageService: ProjectImageService,
    private projectLinkService: ProjectLinkService,
    private skillProjectService: SkillProjectMapService,
  ) {
    super(repo);
  }

  async create(body: CreateProjectBodyDto) {
    const project = new Promise<ProjectEntity>((resolve, reject) => {
      this.repo.manager.transaction(async (manager) => {
        const project = await manager.save(ProjectEntity, {
          title: body.title,
          part: body.part,
          summary: body.summary,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          thumbnailId: body.thumbnailId,
        });

        await this.appendProjectMetadata(manager, project.id, {
          skillIds: body.skillIds,
          images: body.images,
          content: body.contents,
          links: body.links,
        });

        resolve(project);
      });
    });

    return await project;
  }

  async update(id: number, body: UpdateProjectBodyDto) {
    const transaction = new Promise((resolve, reject) => {
      this.repo.manager.transaction(async (manager) => {
        await manager.update(ProjectEntity, id, {
          title: body.title,
          part: body.part,
          summary: body.summary,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          thumbnailId: body.thumbnailId,
        });

        await manager.softDelete(ProjectContentEntity, { projectId: id });
        await manager.softDelete(ProjectImageEntity, { projectId: id });
        await manager.softDelete(SkillProjectMapEntity, { projectId: id });
        await manager.softDelete(ProjectLinkEntity, { projectId: id });

        await this.appendProjectMetadata(manager, id, {
          skillIds: body.skillIds,
          images: body.images,
          content: body.contents,
          links: body.links,
        });

        resolve(true);
      });
    });

    await transaction;
  }

  async deleteProject(id: number) {
    await this.projectContentService.deleteMany({ projectId: id });
    await this.projectImageService.deleteMany({ projectId: id });
    await this.skillProjectService.deleteMany({ projectId: id });
    await this.projectLinkService.deleteMany({ projectId: id });

    await this.deleteById(id);
  }

  // 프로젝트에 스킬, 첨부사진, 내용 추가
  async appendProjectMetadata(
    manager: EntityManager,
    projectId: number,
    metadata: {
      skillIds: number[];
      images: {
        name: string;
        fileId: number;
      }[];
      content: {
        kind: EProjectContentKind;
        content: string;
        children?: string[];
      }[];
      links: {
        name: string;
        url: string;
      }[];
    },
  ) {
    // content 추가
    let contentIdx = 0;
    for (const content of metadata.content) {
      const parentContent = await manager.save(ProjectContentEntity, {
        content: content.content,
        projectId,
        kind: content.kind,
        sequence: 500 - contentIdx,
      });
      if (content.children)
        await manager.save(
          ProjectContentEntity,
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
    await manager.save(
      ProjectImageEntity,
      metadata.images.map((image, idx) => ({
        fileId: image.fileId,
        name: image.name,
        projectId,
        sequence: metadata.images.length - idx,
      })),
    );

    // 스킬 추가
    await manager.save(
      SkillProjectMapEntity,
      metadata.skillIds.map((skillId) => ({
        skillId,
        projectId,
      })),
    );

    // 링크 추가
    await manager.save(
      ProjectLinkEntity,
      metadata.links.map((link, idx) => ({
        name: link.name,
        url: link.url,
        sequence: metadata.links.length - idx,
        projectId,
      })),
    );
  }
}
