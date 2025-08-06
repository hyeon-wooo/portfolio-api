import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminRepository } from '../infra/admin.repository';
import { AdminOrmEntity } from '../infra/admin.entity.orm';
import { AdminService } from '../app/admin.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminOrmEntity])],
  controllers: [AdminController],
  providers: [AdminRepository, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
