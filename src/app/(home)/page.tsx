"use client";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import FolderCard from "~/components/FolderCard";
import SelectionActionBar from "~/components/SelectionActionBar";
import { Button } from "~/components/ui/button";
import { useSelection } from "~/hooks/use-selection";
import { getAllFolders } from "~/server/actions/folder_action";

const HomePage = () => {
  const { setIsOpen } = useSelection((state) => state);
  const { data } = useQuery({
    queryFn: async () => getAllFolders(),
    queryKey: ["all-folders"],
  });

  return (
    <>
      <header className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
            Dashboard
          </h2>

          <Button
            size={"icon"}
            variant={"ghost"}
            className="rounded-full"
            onClick={() => setIsOpen(true)}
          >
            <Info />
          </Button>
        </div>
        <SelectionActionBar />
      </header>

      <section className="flex h-full flex-col gap-2 overflow-y-auto rounded-lg px-4">
        <h3 className="text-balance font-medium">Folders</h3>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
          {data && data.length > 0 ? (
            data.map((item) => <FolderCard data={item} key={item.id} />)
          ) : (
            <p className="text-sm text-muted-foreground">No Folders Here</p>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
