import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ERole } from 'src/auth/role.enum';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // 1. JWT 인증
    const token = request.cookies['at'];
    if (!token) throw new UnauthorizedException('인증 토큰이 없습니다.');

    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    request.user = payload;

    // 2. Role 체크
    if (payload.role !== ERole.ADM) {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }

    // 3. Level 체크
    if (payload.level < 100) {
      throw new ForbiddenException('슈퍼관리자 레벨이 필요합니다.');
    }

    return true;
  }
}
