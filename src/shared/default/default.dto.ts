import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class IdsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}

export class ActivateBodyDto {
  @IsBoolean()
  active: boolean;
}

export class ListQueryDto {
  @IsOptional()
  @IsNumber()
  from?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsBoolean()
  needTotalCount?: boolean;
}
