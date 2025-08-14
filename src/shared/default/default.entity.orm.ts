import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class DefaultOrmEntity {
  @PrimaryGeneratedColumn({ comment: 'PK' })
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    comment: '생성일시',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    comment: '수정일시',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    comment: '삭제일시',
  })
  deletedAt: Date | null;
}
