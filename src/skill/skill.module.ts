import { Module } from '@nestjs/common';
import { SkillEntity } from './skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { SkillContentEntity } from './skill-content/skill-content.entity';
import { SkillContentService } from './skill-content/skill-content.service';

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity, SkillContentEntity])],
  controllers: [SkillController],
  providers: [SkillService, SkillContentService],
  exports: [SkillService],
})
export class SkillModule {}
