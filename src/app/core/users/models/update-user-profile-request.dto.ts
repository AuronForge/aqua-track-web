export interface UpdateUserProfileRequestDto {
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly birthDate: string;
}
