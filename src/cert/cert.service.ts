import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/shared/crud.service';
import { Repository } from 'typeorm';
import { CertEntity } from './cert.entity';

@Injectable()
export class CertService extends CRUDService<CertEntity> {
  constructor(@InjectRepository(CertEntity) repo: Repository<CertEntity>) {
    super(repo);
  }
}
