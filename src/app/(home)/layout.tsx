import Navbar from "~/components/Navbar";

import Image from "next/image";
import { Home, Search, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

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
  return (
    <main className="flex min-h-svh w-full flex-col">
      <Navbar />

      <section className="grid flex-1 grid-cols-[256px,1fr,320px] gap-2 p-4">
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Button
              key={item.title}
              asChild
              variant={"ghost"}
              size={"sm"}
              className="justify-start rounded-full"
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex h-full flex-col gap-4 rounded-3xl bg-secondary/20 p-4">
          {children}
        </div>

        <aside className="flex h-full flex-col items-center justify-center rounded-2xl bg-secondary/20">
          <div className="flex max-w-[180px] flex-col items-center justify-center gap-4 text-balance text-center">
            <Image src={"/filetype-raw.svg"} alt="" width={64} height={64} />
            <p className="text-sm text-muted-foreground">
              Select an item to see the details
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default HomeLayout;
