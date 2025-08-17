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
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  thumbnailId: number;

  @IsArray()
  contents: {
    kind: EProjectContentKind;
    content: string;
    children?: string[];
  }[];

  @IsArray()
  images: {
    name: string;
    fileId: number;
  }[];

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
    this.kind = entity.kind;
    this.content = entity.content;
    this.children = [];
  }

  kind: EProjectContentKind;
  content: string;
  children: string[];
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
      .map((image) => {
        return {
          name: image.name,
          url: image.file.url ?? '',
        };
      });

    this.links = entity.links.map((link) => new ProjectLinkListItemDto(link));

    // 컨텐츠 파싱 및 정렬
    const contentDict = entity.contents.reduce<
      Record<
        number,
        {
          item: ProjectContentItemDto;
          sequence: number;
          children: { item: ProjectContentItemDto; sequence: number }[];
        }
      >
    >((acc, cur) => {
      if (!cur.parentId) {
        acc[cur.id] = {
          item: new ProjectContentItemDto(cur),
          sequence: cur.sequence,
          children: [],
        };
        return acc;
      }
      acc[cur.parentId].children.push({
        item: new ProjectContentItemDto(cur),
        sequence: cur.sequence,
      });
      return acc;
    }, {});

    const temp = Object.values(contentDict).sort(
      (a, b) => b.sequence - a.sequence,
    );
    this.contents = temp.map((cur) => {
      const { item, sequence, children } = cur;
      if (children.length) {
        const sortedChildren = children
          .sort((a, b) => b.sequence - a.sequence)
          .map((child) => child.item.content);
        item.children = sortedChildren;
      }
      return item;
    });
  }

  contents: ProjectContentItemDto[];

  images: {
    name: string;
    url: string;
  }[];

  links: ProjectLinkListItemDto[];
}
