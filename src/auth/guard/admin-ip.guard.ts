import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdmIpGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    let ip = req.header['x-forwarded-for'] || req.connection.remoteAddress;

    // loopback ipv6 -> ipv4
    if (ip === '::1') ip = '127.0.0.1';
    // ipv4-mapped ipv6 -> ipv4
    if (ip && ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

    const allowedIpsStr = this.configService.get('ADMIN_ALLOWD_IPS');
    const allowedIps = allowedIpsStr.split(',');

    if (allowedIps.includes(ip)) return true;

    throw new UnauthorizedException('IP not allowed');
  }
}
