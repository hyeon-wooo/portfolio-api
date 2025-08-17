import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SkillEntity } from '../skill.entity';

@Entity({ name: 'skill_content', comment: '기술내용' })
export class SkillContentEntity extends DefaultOrmEntity {
  @Column('int', { name: 'skill_id', comment: '기술ID (skill.id)' })
  skillId: number;

  @Column('varchar', { name: 'content', comment: '내용', length: 255 })
  content: string;

  @Column('int', { name: 'sequence', comment: '순서', default: 10 })
  sequence: number;

  @ManyToOne(() => SkillEntity)
  @JoinColumn({ name: 'skill_id' })
  skill: SkillEntity;
}
