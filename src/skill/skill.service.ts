import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { SkillEntity } from './skill.entity';
import { CreateSkillBodyDto, UpdateSkillBodyDto } from './skill.dto';
import { EntityNotFoundException } from 'src/shared/default/default.exception';
import { SkillContentService } from './skill-content/skill-content.service';

@Injectable()
export class SkillService extends CRUDService<SkillEntity> {
  constructor(
    @InjectRepository(SkillEntity) repo: Repository<SkillEntity>,
    private readonly skillContentService: SkillContentService,
  ) {
    super(repo);
  }

  async create(body: CreateSkillBodyDto) {
    const { contents, ...rest } = body;
    const skill = await this.createOne(rest);

    await this.skillContentService.createMany(
      contents.map((content) => ({
        content,
        skillId: skill.id,
      })),
    );

    return skill;
  }

  async update(id: number, body: UpdateSkillBodyDto) {
    const { contents, ...rest } = body;

    const updated = await this.updateById(id, rest);

    await this.skillContentService.deleteByWhere({ skillId: id });
    await this.skillContentService.createMany(
      contents.map((content) => ({
        content,
        skillId: id,
      })),
    );

    return updated;
  }
}
