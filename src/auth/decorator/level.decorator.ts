import { SetMetadata } from '@nestjs/common';

export const LEVEL_KEY = 'level';
export const Level = (level: number) => SetMetadata(LEVEL_KEY, level);
