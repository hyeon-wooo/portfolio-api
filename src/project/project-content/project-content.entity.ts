import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { EProjectContentKind } from 'src/project/project.enum';
import { ProjectEntity } from '../project.entity';

@Entity({ name: 'project_content', comment: '프로젝트 내용' })
export class ProjectContentEntity extends DefaultOrmEntity {
  @Column({ comment: '내용' })
  content: string;

  @Column({ comment: '순서' })
  sequence: number;

  @Column({ name: 'project_id', comment: '프로젝트 ID' })
  projectId: number;

  @Column('enum', {
    comment: '내용 종류. 주요기능, 진행과정 등',
    enum: EProjectContentKind,
  })
  kind: EProjectContentKind;

  @Column('int', { name: 'parent_id', comment: '부모 ID', nullable: true })
  parentId: number | null;

  @ManyToOne(() => ProjectEntity, (project) => project.contents)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
