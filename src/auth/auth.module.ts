import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { AdmIpGuard } from './guard/admin-ip.guard';
import { RoleGuard } from './guard/role.guard';
import { LevelGuard } from './guard/level.guard';
import { SuperAdminGuard } from './guard/superadmin.guard';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '1d') },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    AdmIpGuard,
    RoleGuard,
    LevelGuard,
    SuperAdminGuard,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    AdmIpGuard,
    RoleGuard,
    LevelGuard,
    SuperAdminGuard,
  ],
})
export class AuthModule {}
