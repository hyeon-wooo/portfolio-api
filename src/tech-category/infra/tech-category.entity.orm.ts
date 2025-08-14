import { FileOrmEntity } from 'src/file/infra/file.entity.orm';
import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'tech_category', comment: '기술스택' })
export class TechCategoryOrmEntity extends DefaultOrmEntity {
  @Column({ length: 50, comment: '이름' })
  name: string;

  @Column('int', { comment: '순서', default: 10 })
  sequence: number;

  @Column('int', { name: 'file_id', comment: '파일ID (file.id)' })
  fileId: number;

  @ManyToOne(() => FileOrmEntity)
  @JoinColumn({ name: 'file_id' })
  file: FileOrmEntity | null;
}
