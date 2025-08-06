import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { AdminService } from '../admin/app/admin.service';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {}

  @Timeout(1000)
  async createSuperAdminIfNotExists() {
    this.logger.log('Batch: 슈퍼관리자 계정 생성');
    const admin = await this.adminService.findOne({ level: 100 });
    if (admin) {
      this.logger.log('슈퍼관리자 이미 존재');
      return;
    }
    const name = this.configService.get<string>('ADMIN_NAME');
    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    if (!name || !email || !password) {
      this.logger.warn('ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD 환경변수 필요');
      return;
    }
    await this.adminService.create({ name, email, password, level: 100 });
    this.logger.log('슈퍼관리자 계정 생성 완료');
  }
}
