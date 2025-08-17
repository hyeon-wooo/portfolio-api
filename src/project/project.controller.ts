import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectBodyDto,
  ProjectDetailDto,
  ProjectListItemDto,
  ProjectListQueryDto,
  UpdateProjectBodyDto,
} from './project.dto';
import { SkillProjectMapService } from 'src/nm-relation/skill-project/skill-project.service';
import { ProjectEntity } from './project.entity';
import { FindOptionsWhere, In } from 'typeorm';
import { TFindManyOptions } from 'src/shared/crud.service';
import { sendFailRes, sendSuccessRes } from 'src/shared/response';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ERole } from 'src/auth/role.enum';

@Controller('project')
export class ProjectController {
  constructor(
    private service: ProjectService,
    private skillProjectService: SkillProjectMapService,
  ) {}

  @Get('/')
  async getList(@Query() query: ProjectListQueryDto) {
    const condition: FindOptionsWhere<ProjectEntity> = {};
    if (query.skillIds?.length) {
      const filteredProjecIds: number[] =
        await this.skillProjectService.getProjectIdsBySkillIds(query.skillIds);
      condition.id = In(filteredProjecIds);
    }
    if (query.part) condition.part = query.part;

    const options: TFindManyOptions<ProjectEntity> = {
      relations: {
        thumbnail: true,
        skillProjects: {
          skill: { file: true },
        },
      },
    };
    if (query.from) options.offset = query.from;
    if (query.limit) options.limit = query.limit;

    const projects = await this.service.findMany(condition, options);

    const responseData: {
      list: ProjectListItemDto[];
      totalCount?: number;
    } = {
      list: projects.map((project) => new ProjectListItemDto(project)),
    };

    if (query.needTotalCount) {
      const totalCount = await this.service.count(condition);
      responseData.totalCount = totalCount;
    }

    return sendSuccessRes(responseData);
  }

  @Get('/:id')
  async getDetail(@Param('id') idStr: string) {
    const id = Number(idStr);
    const project = await this.service.findOne(
      { id },
      {
        thumbnail: true,
        skillProjects: {
          skill: { file: true },
        },
        contents: true,
        images: { file: true },
        links: true,
      },
    );
    if (!project) return sendFailRes('접근할 수 없는 프로젝트입니다.');

    return sendSuccessRes(new ProjectDetailDto(project));
  }

  @Post('/')
  @Roles(ERole.ADM)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() body: CreateProjectBodyDto) {
    const project = await this.service.create(body);

    return sendSuccessRes({ id: project.id });
  }

  @Put('/:id')
  @Roles(ERole.ADM)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(@Param('id') idStr: string, @Body() body: UpdateProjectBodyDto) {
    const id = Number(idStr);
    await this.service.update(id, body);

    return sendSuccessRes(true);
  }

  @Delete('/:id')
  @Roles(ERole.ADM)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async delete(@Param('id') idStr: string) {
    const id = Number(idStr);
    await this.service.deleteProject(id);

    return sendSuccessRes(true);
  }
}
