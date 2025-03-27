import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Home, LogOut, Search, Settings } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <div className="flex min-w-[250px] flex-col gap-2 overflow-y-auto">
      {items.map((item) => (
        <Button
          asChild
          size={"sm"}
          key={item.title}
          variant={"ghost"}
          className="justify-start rounded-full"
        >
          <Link href={item.url}>
            <item.icon />
            <span>{item.title}</span>
          </Link>
        </Button>
      ))}

      <SignOutButton>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="justify-start rounded-full"
        >
          <LogOut />
          <span>Logout</span>
        </Button>
      </SignOutButton>
    </div>
  );
};

export default Sidebar;
