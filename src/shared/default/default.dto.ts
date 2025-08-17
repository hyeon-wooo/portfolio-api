import { IsArray, IsBoolean, IsNumber } from 'class-validator';

export class IdsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}

export class ActivateBodyDto {
  @IsBoolean()
  active: boolean;
}
