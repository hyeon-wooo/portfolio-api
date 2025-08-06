import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class DefaultOrmEntity {
  @PrimaryGeneratedColumn({ comment: 'PK' })
  id: number;

  @CreateDateColumn({ type: 'timestamp', comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '수정일시' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', comment: '삭제일시' })
  deletedAt: Date | null;
}
