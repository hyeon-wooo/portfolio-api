export class Admin {
  constructor(props: Partial<Admin>) {
    Object.assign(this, props);
  }

  public readonly id: number;
  public name: string;
  public level: number;
  public email: string;
  public password: string;
}
