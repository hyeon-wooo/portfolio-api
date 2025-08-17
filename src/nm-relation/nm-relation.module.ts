import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillProjectMapEntity } from './skill-project/skill-project.entity';
import { SkillProjectMapService } from './skill-project/skill-project.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SkillProjectMapEntity])],
  providers: [SkillProjectMapService],
  exports: [SkillProjectMapService],
})
export class NMRelationModule {}
