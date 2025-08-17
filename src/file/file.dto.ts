import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { EFileUsage } from './file.enum';
import { FileEntity } from './file.entity';

export class UploadFileBodyDto {
  @IsEnum(EFileUsage, { message: 'usage는 유효한 값이어야 합니다.' })
  usage: EFileUsage;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class FileListItemDto {
  constructor(entity: FileEntity) {
    this.id = entity.id;
    this.url = entity.url || '';
  }

  id: number;
  url: string;
  usage: EFileUsage;
}
