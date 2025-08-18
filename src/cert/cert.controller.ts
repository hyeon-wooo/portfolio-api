import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CertService } from './cert.service';
import { sendFailRes, sendSuccessRes } from 'src/shared/response';
import {
  CertDto,
  CertListItemDto,
  CreateCertBodyDto,
  UpdateCertBodyDto,
} from './cert.dto';
import { ListQueryDto } from 'src/shared/default/default.dto';
import { CertEntity } from './cert.entity';
import { TFindManyOptions } from 'src/shared/crud.service';

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

  // 관리자용 목록조회 api
  @Get('/list')
  async getAllForAdm(@Query() query: ListQueryDto) {
    const options: TFindManyOptions<CertEntity> = {};
    if (query.from) options.offset = query.from;
    if (query.limit) options.limit = query.limit;

    const found = await this.service.findMany({}, options);

    let totalCount: number | null = null;
    if (query.needTotalCount) {
      totalCount = await this.service.count({});
    }

    return sendSuccessRes({
      list: found.map((v) => new CertDto(v)),
      totalCount: totalCount ?? null,
    });
  }

  @Get('/:id')
  async getOne(@Param('id') idStr: string) {
    const id = Number(idStr);
    const found = await this.service.findOne({ id });
    if (!found) return sendFailRes('존재하지 않는 자격증입니다.');

    return sendSuccessRes({ cert: new CertDto(found) });
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
