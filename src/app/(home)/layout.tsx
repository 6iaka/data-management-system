"use client";

import { Home, Search, Settings } from "lucide-react";
import Link from "next/link";
import DetailsSidebar from "~/components/DetailsSidebar";
import Navbar from "~/components/Navbar";
import { Button } from "~/components/ui/button";
import { useSelection } from "~/hooks/use-selection";

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

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { resetItems } = useSelection((state) => state);

  return (
    <main className="flex min-h-svh w-full flex-col" onClick={resetItems}>
      <Navbar />

      <section className="grid flex-1 grid-cols-[256px,1fr,320px] gap-2 p-4">
        <div className="flex flex-col gap-2">
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

        <div className="flex h-full flex-col gap-4 rounded-2xl bg-secondary/20 p-4">
          {children}
        </div>

        <DetailsSidebar />
      </section>
    </main>
  );
};

export default HomeLayout;
