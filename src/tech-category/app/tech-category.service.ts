import { Injectable } from '@nestjs/common';
import { TechCategoryRepository } from '../infra/tech-category.repository';
import {
  CreateTechCategoryBodyDto,
  UpdateTechCategoryBodyDto,
} from '../interface/tech-category.dto';
import { FileService } from 'src/file/app/file.service';
import { FileNotFoundException } from 'src/file/domain/file.exception';
import { TechCategory } from '../domain/tech-category.entity';

@Injectable()
export class TechCategoryService {
  constructor(
    private readonly repository: TechCategoryRepository,
    private readonly fileService: FileService,
  ) {}

  async findMany(
    condition?: Record<keyof TechCategory, any>,
  ): Promise<TechCategory[]> {
    const found = await this.repository.findMany(condition ?? {}, {
      order: { sequence: 'DESC' },
      relations: { file: true },
    });
    return found;
  }

  async create(body: CreateTechCategoryBodyDto) {
    const file = await this.fileService.findOne({ id: body.fileId });
    if (!file) throw new FileNotFoundException(body.fileId);

    return await this.repository.createOne(body);
  }

  async update(id: number, body: UpdateTechCategoryBodyDto) {
    const file = await this.fileService.findOne({ id: body.fileId });
    if (!file) throw new FileNotFoundException(body.fileId);

    return await this.repository.updateById(id, body);
  }

  async deleteById(id: number) {
    await this.repository.deleteById(id);
  }

  async deleteMany(ids: number[]) {
    await this.repository.deleteManyById(ids);
  }
}
