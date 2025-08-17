import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProjectEntity } from '../project.entity';

@Entity({ name: 'project_link', comment: '프로젝트 첨부 링크' })
export class ProjectLinkEntity extends DefaultOrmEntity {
  @Column({ name: 'name', comment: '링크 이름' })
  name: string;

  @Column({ name: 'url', comment: '링크 주소' })
  url: string;

  @Column({ name: 'project_id', comment: '프로젝트 ID' })
  projectId: number;

  @ManyToOne(() => ProjectEntity, (project) => project.links)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
