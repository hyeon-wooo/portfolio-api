import { IsDateString, IsString } from 'class-validator';
import { CertEntity } from './cert.entity';

export class CertListItemDto {
  constructor(entity: CertEntity) {
    this.name = entity.name;
    this.d = entity.d.toString();
    this.org = entity.org;
    this.certNo = entity.certNo;
  }

  name: string;
  d: string;
  org: string;
  certNo: string;
}

export class CertDto extends CertListItemDto {
  constructor(entity: CertEntity) {
    super(entity);
    this.id = entity.id;
  }

  readonly id: number;
}

export class CreateCertBodyDto {
  @IsString()
  name: string;

  @IsDateString()
  d: string;

  @IsString()
  org: string;

  @IsString()
  certNo: string;
}

export class UpdateCertBodyDto extends CreateCertBodyDto {}
