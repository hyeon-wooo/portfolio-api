import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { AfterLoad, Column, Entity } from 'typeorm';
import { EFileUsage } from '../domain/file.enum';

@Entity({ name: 'file', comment: '업로드 파일' })
export class FileOrmEntity extends DefaultOrmEntity {
  url: string | null;

  @Column({ type: 'varchar', length: 50, comment: '용도' })
  usage: EFileUsage;

  @Column({ name: 'original_name', length: 255, comment: '원본 파일명' })
  originalName: string;

  @Column({
    name: 'relative_path',
    length: 255,
    comment: '저장 상대 경로 usage/YYYY/MM/DD/uuid.ext',
  })
  relativePath: string;

  @Column({ length: 10, comment: '확장자' })
  extension: string;

  @Column({ type: 'int', comment: '파일 크기(byte)' })
  size: number;

  @Column({ type: 'varchar', length: 100, comment: 'MIME 타입' })
  mimetype: string;

  @Column({ type: 'boolean', default: false, comment: '활성화 여부' })
  active: boolean;

  @AfterLoad()
  afterLoad() {
    this.url = this.active
      ? `${process.env.IMAGE_BASE_URL}/${this.relativePath}`
      : null;
  }
}
