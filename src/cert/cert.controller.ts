import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CertService } from './cert.service';
import { sendSuccessRes } from 'src/shared/response';
import {
  CertListItemDto,
  CreateCertBodyDto,
  UpdateCertBodyDto,
} from './cert.dto';

@Controller('cert')
export class CertController {
  constructor(private readonly service: CertService) {}

  @Get('/')
  async getAll() {
    const found = await this.service.findMany();
    return sendSuccessRes({
      list: found.map((v) => new CertListItemDto(v)),
    });
  }

  @Post('/')
  async create(@Body() body: CreateCertBodyDto) {
    const created = await this.service.createOne(body);

    return sendSuccessRes({ id: created.id });
  }

  @Put('/:id')
  async update(@Param('id') idStr: string, @Body() body: UpdateCertBodyDto) {
    const id = Number(idStr);
    const updated = await this.service.updateById(id, body);

    return sendSuccessRes({ id: updated.id });
  }
}
