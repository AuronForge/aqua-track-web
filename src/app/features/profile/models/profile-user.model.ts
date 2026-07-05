export interface ProfileUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  avatarUrl: string | null;
  initials: string;
  memberSince: string;
}
