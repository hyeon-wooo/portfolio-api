import { Module } from '@nestjs/common';
import { CertController } from './cert.controller';
import { CertService } from './cert.service';
import { CertEntity } from './cert.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CertEntity])],
  controllers: [CertController],
  providers: [CertService],
})
export class CertModule {}
