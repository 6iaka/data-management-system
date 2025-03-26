import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Home, Search, Settings } from "lucide-react";

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
    </div>
  );
};

export default Sidebar;
