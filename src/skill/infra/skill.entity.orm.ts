import { FileOrmEntity } from 'src/file/infra/file.entity.orm';
import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ESkillLevel } from '../domain/skill.enum';
import { SkillContentOrmEntity } from './skill-content/skill-content.entity.orm';

@Entity({ name: 'skill', comment: '기술스택' })
export class SkillOrmEntity extends DefaultOrmEntity {
  @Column({ length: 50, comment: '이름' })
  name: string;

  @Column('int', { comment: '순서', default: 10 })
  sequence: number;

  @Column('enum', { name: 'level', comment: '기술수준', enum: ESkillLevel })
  level: ESkillLevel;

  @Column('int', { name: 'file_id', comment: '이미지파일ID (file.id)' })
  fileId: number;

  @ManyToOne(() => FileOrmEntity)
  @JoinColumn({ name: 'file_id' })
  file: FileOrmEntity | null;

  @OneToMany(() => SkillContentOrmEntity, (content) => content.skill)
  contents: SkillContentOrmEntity[];
}
