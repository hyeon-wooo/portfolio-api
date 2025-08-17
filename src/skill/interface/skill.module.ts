import { Module } from '@nestjs/common';
import { SkillOrmEntity } from '../infra/skill.entity.orm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillService } from '../app/skill.service';
import { SkillController } from './skill.controller';
import { SkillRepository } from '../infra/skill.repository';
import { SkillContentOrmEntity } from '../infra/skill-content/skill-content.entity.orm';
import { SkillContentRepository } from '../infra/skill-content/skill-content.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SkillOrmEntity, SkillContentOrmEntity])],
  controllers: [SkillController],
  providers: [SkillService, SkillRepository, SkillContentRepository],
  exports: [SkillService],
})
export class SkillModule {}
