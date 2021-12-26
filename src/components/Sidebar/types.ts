export type SidebarItem = {
  icon: string | null;
  title: string;
  href: string;
};

export type Sidebar = {
  items?: SidebarItem[];
};
