import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ERole } from 'src/auth/role.enum';

@Injectable()
export class SuperAdminGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    if (!super.canActivate(context)) {
      console.log('#1', 'UnauthorizedException');
      throw new UnauthorizedException('인증이 필요합니다.');
    }

    const request = context.switchToHttp().getRequest();
    console.log('user: ', request.user);

    // 2. Role 체크
    if (request.user.role !== ERole.ADM) {
      throw new ForbiddenException('관리자 권한이 필요합니다.');
    }

    // 3. Level 체크
    if (request.user.level < 100) {
      throw new ForbiddenException('슈퍼관리자 레벨이 필요합니다.');
    }

    return true;
  }
}
