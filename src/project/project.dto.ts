import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EProjectContentKind, EProjectPart } from './project.enum';
import { SkillListItemDto } from 'src/skill/skill.dto';
import { ListQueryDto } from 'src/shared/default/default.dto';
import { Transform } from 'class-transformer';
import { ProjectEntity } from './project.entity';
import { ProjectContentEntity } from './project-content/project-content.entity';
import { FileListItemDto } from 'src/file/file.dto';
import { ProjectLinkEntity } from './project-link/project-link.entity';

export class CreateProjectBodyDto {
  @IsString()
  title: string;

  @IsEnum(EProjectPart)
  part: EProjectPart;

  @IsString()
  summary: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  thumbnailId: number;

  @IsArray()
  contents: {
    kind: EProjectContentKind;
    content: string;
    children?: string[];
  }[];

  @IsArray()
  @IsNumber({}, { each: true })
  imageIds: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  skillIds: number[];

  @IsArray()
  links: {
    name: string;
    url: string;
  }[];
}

export class UpdateProjectBodyDto extends CreateProjectBodyDto {}

export class ProjectListQueryDto extends ListQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    console.log('value', value);
    if (value.length > 0)
      return value
        .split(',')
        .map((v) => Number(v) || 0)
        .filter(Boolean);
    return undefined;
  })
  skillIds?: number[];

  @IsOptional()
  @IsEnum(EProjectPart)
  part?: EProjectPart;
}

export class ProjectListItemDto {
  constructor(entity: ProjectEntity) {
    this.id = entity.id;
    this.title = entity.title;
    this.part = entity.part;
    this.summary = entity.summary;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.thumbnailUrl = entity.thumbnail?.url || '';
    this.skills = entity.skillProjects.map(
      (skillProject) => new SkillListItemDto(skillProject.skill),
    );
  }

  id: number;

  title: string;

  part: EProjectPart;

  summary: string;

  startDate: Date;

  endDate: Date;

  thumbnailUrl: string;

  skills: SkillListItemDto[];
}

class ProjectContentItemDto {
  constructor(entity: ProjectContentEntity) {
    this.id = entity.id;
    this.kind = entity.kind;
    this.sequence = entity.sequence;
    this.content = entity.content;
    this.children = [];
  }

  id: number;
  kind: EProjectContentKind;
  sequence: number;
  content: string;
  children: ProjectContentItemDto[];
}

class ProjectLinkListItemDto {
  constructor(entity: ProjectLinkEntity) {
    this.name = entity.name;
    this.url = entity.url;
  }

  id: number;
  name: string;
  url: string;
}

export class ProjectDetailDto extends ProjectListItemDto {
  constructor(entity: ProjectEntity) {
    super(entity);

    this.images = entity.images
      .sort((a, b) => b.sequence - a.sequence)
      .map((image) => new FileListItemDto(image.file));

    this.links = entity.links.map((link) => new ProjectLinkListItemDto(link));

    // 컨텐츠 파싱 및 정렬
    const contentDict = entity.contents.reduce<
      Record<number, ProjectContentItemDto>
    >((acc, cur) => {
      if (!cur.parentId) {
        acc[cur.id] = new ProjectContentItemDto(cur);
        return acc;
      }
      acc[cur.parentId].children.push(new ProjectContentItemDto(cur));
      return acc;
    }, {});

    this.contents = Object.values(contentDict).sort(
      (a, b) => b.sequence - a.sequence,
    );
    this.contents.forEach((content) => {
      if (!content.children.length) return;
      content.children.sort((a, b) => b.sequence - a.sequence);
    });
  }

  contents: ProjectContentItemDto[];

  images: FileListItemDto[];

  links: ProjectLinkListItemDto[];
}
