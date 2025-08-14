import { IsArray, IsNumber } from 'class-validator';

export class IdsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}
