import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LEVEL_KEY } from '../decorator/level.decorator';

@Injectable()
export class LevelGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredLevel = this.reflector.get<number>(
      LEVEL_KEY,
      context.getHandler(),
    );
    if (!requiredLevel) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException('인증 정보가 없습니다.');

    if (user.level < requiredLevel) {
      throw new ForbiddenException('권한이 부족합니다.');
    }
    return true;
  }
}
