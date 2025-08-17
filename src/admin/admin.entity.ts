import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'admin', comment: '관리자' })
export class AdminEntity extends DefaultOrmEntity {
  @Column({ length: 50, comment: '이름' })
  name: string;

  @Column('int', { comment: '레벨' })
  level: number;

  @Column({ length: 100, comment: '이메일' })
  email: string;

  @Column({ length: 255, comment: '비밀번호', select: false })
  password: string;
}
