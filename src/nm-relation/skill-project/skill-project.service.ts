import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { In, Repository } from 'typeorm';
import { SkillProjectMapEntity } from './skill-project.entity';

@Injectable()
export class SkillProjectMapService extends CRUDService<SkillProjectMapEntity> {
  constructor(
    @InjectRepository(SkillProjectMapEntity)
    repo: Repository<SkillProjectMapEntity>,
  ) {
    super(repo);
  }

  async getProjectIdsBySkillIds(skillIds: number[]) {
    const skillProjectMaps = await this.repo.find({
      where: { skillId: In(skillIds) },
      select: {
        projectId: true,
      },
    });
    return skillProjectMaps.map((map) => map.projectId);
  }
}
