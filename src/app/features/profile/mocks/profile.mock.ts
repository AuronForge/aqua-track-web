import { SelectFormfieldOption } from '../../../shared/components/formfields/select-formfield/select-formfield-option.model';
import { ProfileSecurity } from '../models/profile-security.model';

export const MOCK_PROFILE_SECURITY: ProfileSecurity = {
  passwordLastChangedAt: '2026-06-02T12:00:00.000Z',
  lastLoginAt: '2026-02-28T13:30:00.000Z',
};

export const MOCK_AQUARIUM_OPTIONS: SelectFormfieldOption[] = [
  { id: 'aquarium-1', title: 'Reef Tank' },
  { id: 'aquarium-2', title: 'Freshwater Community' },
  { id: 'aquarium-3', title: 'Betta Tank' },
];
