import { DefaultOrmEntity } from 'src/shared/default/default.entity.orm';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'cert', comment: '자격증 취득 내역', orderBy: { d: 'DESC' } })
export class CertEntity extends DefaultOrmEntity {
  @Column({ comment: '자격증 이름' })
  name: string;

  @Column('date', { comment: '취득일' })
  d: string;

  @Column({ comment: '발급 기관' })
  org: string;

  @Column({ name: 'cert_no', comment: '자격증 번호' })
  certNo: string;
}
