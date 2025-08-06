import { IDefaultRepositoryInterface } from 'src/shared/default/default.interface';
import { Admin } from './admin.entity';

export interface IAdminRepository extends IDefaultRepositoryInterface<Admin> {
  findByEmailWithPassword(email: string): Promise<Admin | null>;
}
