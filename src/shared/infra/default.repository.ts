import {
  FindManyOptions,
  FindOptions,
  FindOptionsRelations,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { IDefaultRepositoryInterface } from '../default.interface';

export abstract class DefaultRepository<
  DomainEntity,
  OrmEntity extends ObjectLiteral,
> implements IDefaultRepositoryInterface<DomainEntity>
{
  constructor(protected readonly ormRepo: Repository<OrmEntity>) {}

  protected abstract toDomain(entity: OrmEntity): DomainEntity;
  protected abstract toOrmEntity(
    domain: Partial<DomainEntity>,
  ): Partial<OrmEntity>;

  // 조회
  async findOne(
    condition: Partial<Record<keyof DomainEntity, any>>,
  ): Promise<DomainEntity | null> {
    const entity = await this.ormRepo.findOne({ where: condition as any });
    return entity ? this.toDomain(entity) : null;
  }

  async findMany(
    condition?: Partial<Record<keyof DomainEntity, any>>,
    options?: {
      relations?: Partial<Record<keyof DomainEntity, any>>;
      limit?: number;
      offset?: number;
      order: Partial<Record<keyof DomainEntity, 'ASC' | 'DESC'>>;
      withDeleted?: boolean;
    },
  ): Promise<DomainEntity[]> {
    const findOptions: FindManyOptions<OrmEntity> = { where: condition as any };
    if (options?.relations)
      findOptions.relations =
        options.relations as FindOptionsRelations<OrmEntity>;

    if (options?.limit) findOptions.take = options.limit;

    if (options?.offset) findOptions.skip = options.offset;

    if (options?.order) findOptions.order = options.order as any;

    if (options?.withDeleted) findOptions.withDeleted = true;

    const entities = await this.ormRepo.find(findOptions);
    return entities.map(this.toDomain.bind(this));
  }

  // 생성
  async createOne(data: Partial<DomainEntity>): Promise<DomainEntity> {
    const entity = this.ormRepo.create(
      this.toOrmEntity.bind(this)(data) as OrmEntity,
    );
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async createMany(data: Partial<DomainEntity>[]): Promise<DomainEntity[]> {
    const entities = this.ormRepo.create(data.map(this.toOrmEntity.bind(this)));
    const saved = await this.ormRepo.save(entities);
    return saved.map(this.toDomain.bind(this));
  }

  // 수정
  async updateById(
    id: number,
    data: Partial<DomainEntity>,
  ): Promise<DomainEntity> {
    await this.ormRepo.update(id, data as any);
    const updated = await this.ormRepo.findOne({ where: { id } as any });
    if (!updated) throw new Error('Entity not found');
    return this.toDomain(updated);
  }

  async updateMany(
    condition: Partial<Record<keyof DomainEntity, any>>,
    data: Partial<DomainEntity>[],
  ): Promise<DomainEntity[]> {
    const entities = await this.ormRepo.find({ where: condition as any });
    const updatedEntities = await Promise.all(
      entities.map((entity, idx) =>
        this.ormRepo.save({ ...entity, ...data[idx] } as any),
      ),
    );
    return updatedEntities.map(this.toDomain.bind(this));
  }

  // 삭제
  async deleteById(id: number): Promise<void> {
    await this.ormRepo.delete(id);
  }

  async deleteManyById(ids: number[]): Promise<void> {
    await this.ormRepo.delete(ids as any);
  }

  async deleteMany(
    condition: Partial<Record<keyof DomainEntity, any>>,
  ): Promise<void> {
    const entities = await this.ormRepo.find({ where: condition as any });
    await this.ormRepo.remove(entities);
  }
}
