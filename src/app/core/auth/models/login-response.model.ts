import { AuthUser } from './auth-user.model';

export interface LoginResponse {
  readonly user: AuthUser;
  readonly accessToken: string;
  readonly refreshToken: string;
}
