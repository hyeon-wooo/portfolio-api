import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProjectEntity } from '../project.entity';
import { FileEntity } from 'src/file/file.entity';

@Entity({ name: 'project_image', comment: '프로젝트 첨부사진' })
export class ProjectImageEntity extends DefaultOrmEntity {
  @Column('int', { name: 'project_id', comment: '프로젝트 ID (project.id)' })
  projectId: number;

  @Column('int', { name: 'file_id', comment: '파일 ID (file.id)' })
  fileId: number;

  @Column('varchar', { name: 'name', comment: '이미지 이름', default: '' })
  name: string;

  @Column('int', {
    name: 'sequence',
    comment: '순서. 높을 수록 우선.',
    default: 10,
  })
  sequence: number;

  @ManyToOne(() => ProjectEntity, (project) => project.images)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;
}
