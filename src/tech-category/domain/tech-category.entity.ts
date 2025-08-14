import { File } from 'src/file/domain/file.entity';

export class TechCategory {
  constructor(props: Partial<TechCategory>) {
    Object.assign(this, props);
  }

  public readonly id: number;
  public name: string;
  public sequence: number;
  public fileId: number;
  public file: File | null;
}
