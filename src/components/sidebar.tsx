import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { EditorSideBar, OwnerSideBar } from "~/constants/sidebars";
import { api } from "~/utils/api";

const Sidebar = () => {
  const { data: self, isLoading } = api.user.self.useQuery();

  const sideBar = self?.role === "OWNER" ? OwnerSideBar : EditorSideBar;
  return (
    <div className="flex min-h-screen w-2/12 flex-col  bg-foreground px-5 pt-5">
      {sideBar.map((item) => (
        <Link
          href={item.link}
          key={item.name}
          className="p-3 font-medium text-background"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
