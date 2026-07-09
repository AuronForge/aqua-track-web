export interface FormfieldAction {
  id: string;
  icon: string;
  ariaLabel: string;
  position?: 'prefix' | 'suffix';
  iconFamily?: string;
  disabled?: boolean;
  hidden?: boolean;
}
