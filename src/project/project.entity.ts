import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EProjectPart } from './project.enum';
import { ProjectContentEntity } from './project-content/project-content.entity';
import { FileEntity } from 'src/file/file.entity';
import { SkillProjectMapEntity } from 'src/nm-relation/skill-project/skill-project.entity';
import { ProjectImageEntity } from './project-image/project-image.entity';
import { ProjectLinkEntity } from './project-link/project-link.entity';

@Entity()
export class ProjectEntity extends DefaultOrmEntity {
  @Column({ comment: '프로젝트 이름' })
  title: string;

  @Column({ comment: '개발파트 구분' })
  part: EProjectPart;

  @Column({ comment: '요약' })
  summary: string;

  @Column('date', { name: 'start_date', comment: '시작일' })
  startDate: Date;

  @Column('date', { name: 'end_date', comment: '종료일' })
  endDate: Date;

  @Column({ name: 'thumbnail_id', comment: '썸네일 파일 ID', nullable: true })
  thumbnailId: number | null;

  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail: FileEntity;

  @OneToMany(() => ProjectContentEntity, (content) => content.project)
  @JoinColumn({ name: 'project_id' })
  contents: ProjectContentEntity[];

  @OneToMany(
    () => SkillProjectMapEntity,
    (skillProject) => skillProject.project,
  )
  skillProjects: SkillProjectMapEntity[];

  @OneToMany(() => ProjectImageEntity, (image) => image.project)
  images: ProjectImageEntity[];

  @OneToMany(() => ProjectLinkEntity, (link) => link.project)
  links: ProjectLinkEntity[];
}
