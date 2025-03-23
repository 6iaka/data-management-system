"use client";

import DetailsSidebar from "~/components/DetailsSidebar";
import Navbar from "~/components/Navbar";
import Sidebar from "~/components/Sidebar";
import { useSelection } from "~/hooks/use-selection";

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { resetItems, isOpen } = useSelection((state) => state);

  return (
    <main className="flex h-screen w-screen flex-col" onClick={resetItems}>
      <Navbar />

      <section className="flex min-h-0 flex-1 gap-2 p-4">
        <Sidebar />

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-2xl bg-secondary/20 p-4">
          {children}
        </div>

        {isOpen && <DetailsSidebar />}
      </section>
    </main>
  );
};

export default HomeLayout;
