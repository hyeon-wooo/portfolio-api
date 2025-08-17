import { ProjectOrmEntity } from 'src/project/infra/project.entity.orm';
import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { SkillEntity } from 'src/skill/skill.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'skill_project_map',
  comment: '스킬-프로젝트 n:m 관계를 위한 테이블',
})
export class SkillProjectMapEntity extends DefaultOrmEntity {
  @Column({ name: 'skill_id', comment: '스킬 ID' })
  skillId: number;

  @Column({ name: 'project_id', comment: '프로젝트 ID' })
  projectId: number;

  @ManyToOne(() => SkillEntity)
  @JoinColumn({ name: 'skill_id' })
  skill: SkillEntity;

  @ManyToOne(() => ProjectOrmEntity)
  @JoinColumn({ name: 'project_id' })
  project: ProjectOrmEntity;
}
