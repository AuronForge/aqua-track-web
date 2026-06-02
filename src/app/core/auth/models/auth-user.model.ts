export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatarUrl: string | null;
  readonly status: string;
  readonly role: string;
  readonly plan: string;
}
