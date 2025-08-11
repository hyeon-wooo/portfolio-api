import { EFileUsage } from './file.enum';

export class File {
  constructor(props: Partial<File>) {
    Object.assign(this, props);
  }

  public readonly id: number;
  public usage: EFileUsage;
  public originalName: string;
  public relativePath: string;
  public extension: string;
  public size: number;
  public mimetype: string;
  public active: boolean;
  public url: string | null;
}
