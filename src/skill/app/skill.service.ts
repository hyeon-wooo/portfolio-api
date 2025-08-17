import { Injectable } from '@nestjs/common';
import { SkillRepository } from '../infra/skill.repository';
import { CreateSkillBodyDto, UpdateSkillBodyDto } from '../interface/skill.dto';
import { FileService } from 'src/file/app/file.service';
import { FileNotFoundException } from 'src/file/domain/file.exception';
import { Skill } from '../domain/skill.entity';
import { SkillContentRepository } from '../infra/skill-content/skill-content.repository';
import { In } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    private readonly repository: SkillRepository,
    private readonly skillContentRepository: SkillContentRepository,
    private readonly fileService: FileService,
  ) {}

  async findMany(condition?: Record<keyof Skill, any>): Promise<Skill[]> {
    const found = await this.repository.findMany(condition ?? {}, {
      order: { sequence: 'DESC' },
      relations: { file: true, contents: true },
    });
    return found;
  }

  async create(body: CreateSkillBodyDto) {
    const file = await this.fileService.findOne({ id: body.fileId });
    if (!file) throw new FileNotFoundException(body.fileId);

    const { contents, ...rest } = body;

    const created = await this.repository.createOne(rest);

    // await this.skillContentRepository.deleteMany({ skillId: created.id });
    const createdContents = await this.skillContentRepository.createMany(
      contents.map((content, i) => ({
        content,
        sequence: 50 + contents.length - i,
        skillId: created.id,
      })),
    );
    return { ...created, contents: createdContents };
  }

  async update(id: number, body: UpdateSkillBodyDto) {
    const file = await this.fileService.findOne({ id: body.fileId });
    if (!file) throw new FileNotFoundException(body.fileId);

    const { contents, ...rest } = body;

    const updated = await this.repository.updateById(id, rest);

    await this.skillContentRepository.deleteMany({ skillId: id });
    await this.skillContentRepository.createMany(
      contents.map((content, i) => ({
        content,
        sequence: 50 + contents.length - i,
        skillId: id,
      })),
    );

    return updated;
  }

  async deleteById(id: number) {
    await this.repository.deleteById(id);
    await this.skillContentRepository.deleteMany({ skillId: id });
  }

  async deleteMany(ids: number[]) {
    await this.repository.deleteManyById(ids);
    await this.skillContentRepository.deleteMany({ skillId: In(ids) });
  }
}
