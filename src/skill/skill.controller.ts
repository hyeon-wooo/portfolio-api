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

import { SkillService } from './skill.service';
import {
  CreateSkillBodyDto,
  DeleteSkillBodyDto,
  UpdateSkillBodyDto,
} from './skill.dto';
import { sendFailRes, sendSuccessRes } from 'src/shared/response';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ERole } from 'src/auth/role.enum';
import { FileNotFoundException } from 'src/file/file.exception';
import { EntityNotFoundException } from 'src/shared/default/default.exception';
import { ActivateBodyDto } from 'src/shared/default/default.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly service: SkillService) {}

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
  async create(@Body() body: CreateSkillBodyDto) {
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

  // 필터 활성화
  @Post('/:id/activate/filter')
  @Roles(ERole.ADM)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async activateFilter(
    @Param('id') idStr: string,
    @Body() body: ActivateBodyDto,
  ) {
    const id = Number(idStr);
    await this.service.updateById(id, {
      isActiveFilter: body.active,
    });
    return sendSuccessRes(true);
  }

  // 수정
  @Put('/:id')
  @Roles(ERole.ADM)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(@Param('id') idStr: string, @Body() body: UpdateSkillBodyDto) {
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
  async deleteMany(@Body() body: DeleteSkillBodyDto) {
    await this.service.deleteManyById(body.ids);
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
