import {
  FindManyOptions,
  FindOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { EntityNotFoundException } from './default/default.exception';

export type TFindManyOptions<Entity> = {
  relations?: Partial<Record<keyof Entity, any>>;
  limit?: number;
  offset?: number;
  order?: Partial<Record<keyof Entity, 'ASC' | 'DESC'>>;
  withDeleted?: boolean;
};

export class CRUDService<Entity extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<Entity>) {}

  // 조회
  async findOne(
    condition: Partial<Record<keyof Entity, any>>,
    relations?: Partial<Record<keyof Entity, any>>,
  ): Promise<Entity | null> {
    const entity = await this.repo.findOne({
      where: condition as any,
      relations: relations as FindOptionsRelations<Entity>,
    });
    return entity;
  }

  async findMany(
    condition?: Partial<Record<keyof Entity, any>>,
    options?: TFindManyOptions<Entity>,
  ): Promise<Entity[]> {
    const findOptions: FindManyOptions<Entity> = { where: condition as any };
    if (options?.relations)
      findOptions.relations = options.relations as FindOptionsRelations<Entity>;

    if (options?.limit) findOptions.take = options.limit;

    if (options?.offset) findOptions.skip = options.offset;

    if (options?.order) findOptions.order = options.order as any;

    if (options?.withDeleted) findOptions.withDeleted = true;

    const entities = await this.repo.find(findOptions);
    return entities;
  }

  // 생성
  async createOne(data: Partial<Entity>): Promise<Entity> {
    const saved = await this.repo.save(data as any);
    return saved;
  }

  async createMany(data: Partial<Entity>[]): Promise<Entity[]> {
    const saved = await this.repo.save(data as any);
    return saved;
  }

  // 수정
  async updateById(id: number, data: Partial<Entity>): Promise<Entity> {
    await this.repo.update(id, data as any);
    const updated = await this.repo.findOne({ where: { id } as any });
    if (!updated) throw new EntityNotFoundException('Entity not found');
    return updated;
  }

  async updateMany(
    condition: Partial<Record<keyof Entity, any>>,
    data: Partial<Entity>[],
  ): Promise<Entity[]> {
    const entities = await this.repo.find({ where: condition as any });
    const updatedEntities = await Promise.all(
      entities.map((entity, idx) =>
        this.repo.save({ ...entity, ...data[idx] } as any),
      ),
    );
    return updatedEntities;
  }

  async updateByWhere(
    condition: FindOptionsWhere<Entity>,
    data: Partial<Entity>,
  ): Promise<void> {
    await this.repo.update(condition as any, data);
  }

  // 삭제
  async deleteById(id: number): Promise<void> {
    await this.repo.softRemove({ id } as any);
  }

  async deleteManyById(ids: number[]): Promise<void> {
    await this.repo.softDelete(ids);
  }

  async deleteMany(
    condition: Partial<Record<keyof Entity, any>>,
  ): Promise<void> {
    const entities = await this.repo.find({ where: condition as any });
    await this.repo.softRemove(entities);
  }

  async deleteByWhere(condition: FindOptionsWhere<Entity>): Promise<void> {
    await this.repo.softRemove(condition as any);
  }

  async count(condition?: FindOptionsWhere<Entity>): Promise<number> {
    return this.repo.count({ where: condition ?? {} });
  }
}
