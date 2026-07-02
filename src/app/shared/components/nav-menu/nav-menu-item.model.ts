export interface NavMenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
  roles?: string[];
}
