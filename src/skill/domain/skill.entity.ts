import { File } from 'src/file/domain/file.entity';
import { ESkillLevel } from './skill.enum';
import { SkillContent } from './skill-content/skill-content.entity';

export class Skill {
  constructor(props: Partial<Skill>) {
    Object.assign(this, props);
  }

  public readonly id: number;
  public name: string;
  public sequence: number;
  public level: ESkillLevel;
  public fileId: number;
  public file: File | null;
  public contents: string[];
}
