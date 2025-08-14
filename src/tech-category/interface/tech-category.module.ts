import { Module } from '@nestjs/common';
import { TechCategoryOrmEntity } from '../infra/tech-category.entity.orm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechCategoryService } from '../app/tech-category.service';
import { TechCategoryController } from './tech-category.controller';
import { TechCategoryRepository } from '../infra/tech-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TechCategoryOrmEntity])],
  controllers: [TechCategoryController],
  providers: [TechCategoryService, TechCategoryRepository],
  exports: [TechCategoryService],
})
export class TechCategoryModule {}
