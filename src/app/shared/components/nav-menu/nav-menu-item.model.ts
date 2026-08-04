export interface NavMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  exact?: boolean;
  roles?: string[];
  allowedPlans?: string[];
  displayRoute?: boolean;
  children?: NavMenuItem[];
}
