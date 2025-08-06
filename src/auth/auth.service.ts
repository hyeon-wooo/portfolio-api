import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TJwtPayload } from './auth.type';
import { ERole } from './role.enum';
import { Admin } from 'src/admin/domain/admin.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signWithAdmin(admin: Admin): string {
    return this.jwtService.sign({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      level: admin.level,
      role: ERole.ADM,
    });
  }

  signRefreshWithAdmin(admin: Admin): string {
    return this.jwtService.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        level: admin.level,
        role: ERole.ADM,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );
  }

  verify(token: string): TJwtPayload {
    return this.jwtService.verify(token);
  }

  verifyRefresh(token: string): TJwtPayload | null {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (e) {
      return null;
    }
  }

  decode(token: string): TJwtPayload {
    return this.jwtService.decode(token);
  }
}
