export interface SidebarLink {
  title: string;
  route: string;
  icon: string;
}

export interface SidebarSection {
  title: string;
  links: SidebarLink[];
}