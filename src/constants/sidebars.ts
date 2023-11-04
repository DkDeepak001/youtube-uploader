const commonSidebar = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Videos",
    link: "/videos",
  },
];

export const EditorSideBar = [...commonSidebar];

export const OwnerSideBar = [
  ...commonSidebar,
  {
    name: "Upload",
    link: "/upload",
  },
  {
    name: "Editors",
    link: "/editors",
  },
  // Add other Owner-specific items here
];
