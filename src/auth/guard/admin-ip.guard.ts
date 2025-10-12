import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdmIpGuard implements CanActivate {
  private readonly logger = new Logger('AdmIpGuard');
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const xri = (req.headers['x-real-ip'] as string) ?? '';
    const xff = (req.headers['x-forwarded-for'] as string) ?? '';
    let ip =
      xri || xff.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress;

    // loopback ipv6 -> ipv4
    if (ip === '::1') ip = '127.0.0.1';
    // ipv4-mapped ipv6 -> ipv4
    if (ip && ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

    const allowedIpsStr = this.configService.get('ADMIN_ALLOWD_IPS');
    const allowedIps = allowedIpsStr.split(',');
    this.logger.log(`allowedIps: ${typeof allowedIps} / ${allowedIps.length}`);
    this.logger.log(`ip: ${ip}`);
    if (allowedIps.length === 0) return true;

    if (allowedIps.includes(ip)) return true;

    throw new UnauthorizedException('IP not allowed');
  }
}
