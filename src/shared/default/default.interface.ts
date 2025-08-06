export interface IDefaultRepositoryInterface<T> {
  // 조회
  findOne(condition: Partial<Record<keyof T, any>>): Promise<T | null>;
  findMany(
    condition?: Partial<Record<keyof T, any>>,
    options?: {
      relations?: Partial<Record<keyof T, any>>;
      limit?: number;
      offset?: number;
      order: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
      withDeleted?: boolean;
    },
  ): Promise<T[]>;

  // 생성
  createOne(data: Partial<T>): Promise<T>;
  createMany(data: Partial<T>[]): Promise<T[]>;

  // 수정
  updateById(id: number, data: Partial<T>): Promise<T>;
  updateMany(
    condition: Partial<Record<keyof T, any>>,
    data: Partial<T>[],
  ): Promise<T[]>;

  // 삭제
  deleteById(id: number): Promise<void>;
  deleteManyById(ids: number[]): Promise<void>;
  deleteMany(condition: Partial<Record<keyof T, any>>): Promise<void>;
}
