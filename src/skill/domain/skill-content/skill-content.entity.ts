export class SkillContent {
  constructor(props: Partial<SkillContent>) {
    Object.assign(this, props);
  }

  id: number;
  skillId: number;
  content: string;
  sequence: number;
}
