import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from '../app/file.service';
import { FileRepository } from '../infra/file.repository';
import { FileOrmEntity } from '../infra/file.entity.orm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([FileOrmEntity])],
  controllers: [FileController],
  providers: [FileService, FileRepository],
  exports: [FileService, FileRepository],
})
export class FileModule {}
