import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { EFileUsage } from '../domain/file.enum';

export class UploadFileBodyDto {
  @IsEnum(EFileUsage, { message: 'usage는 유효한 값이어야 합니다.' })
  usage: EFileUsage;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
