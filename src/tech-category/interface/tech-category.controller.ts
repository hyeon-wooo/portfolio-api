import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { TechCategoryService } from '../app/tech-category.service';
import {
  CreateTechCategoryBodyDto,
  DeleteTechCategoryBodyDto,
  UpdateTechCategoryBodyDto,
} from './tech-category.dto';
import { sendFailRes, sendSuccessRes } from 'src/shared/response';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ERole } from 'src/auth/role.enum';
import { FileService } from 'src/file/app/file.service';
import { FileNotFoundException } from 'src/file/domain/file.exception';
import { EntityNotFoundException } from 'src/shared/default/default.exception';

@Controller('tech-category')
export class TechCategoryController {
  constructor(private readonly service: TechCategoryService) {}

  @Get('/')
  async findAll() {
    const techCategories = await this.service.findMany();
    return sendSuccessRes({
      list: techCategories,
    });
  }

  // 추가
  @Post('/')
  @Roles(ERole.ADM)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() body: CreateTechCategoryBodyDto) {
    try {
      const created = await this.service.create(body);
      return sendSuccessRes({
        id: created.id,
      });
    } catch (e) {
      if (e instanceof FileNotFoundException) return sendFailRes(e.message);

      throw e;
    }
  }

  // 수정
  @Put('/:id')
  @Roles(ERole.ADM)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdateTechCategoryBodyDto,
  ) {
    try {
      const id = Number(idStr);
      const updated = await this.service.update(id, body);
      return sendSuccessRes({
        id: updated.id,
      });
    } catch (e) {
      if (e instanceof FileNotFoundException) return sendFailRes(e.message);
      if (e instanceof EntityNotFoundException) return sendFailRes(e.message);

      throw e;
    }
  }

  // 삭제: 여러개
  @Delete('/')
  @Roles(ERole.ADM)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteMany(@Body() body: DeleteTechCategoryBodyDto) {
    await this.service.deleteMany(body.ids);
    return sendSuccessRes(true);
  }

  // 삭제: 한개
  @Delete('/:id')
  @Roles(ERole.ADM)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteOne(@Param('id') idStr: string) {
    const id = Number(idStr);
    await this.service.deleteById(id);
    return sendSuccessRes(true);
  }
}
