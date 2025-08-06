import { ERole } from 'src/auth/role.enum';

export const ACCESS_COOKIE_NAME = 'at';
export const REFRESH_COOKIE_NAME = 'rt';

export type TJwtPayload = {
  id: number;
  email?: string;
  name?: string;
  level?: number;
  role: ERole;
};
