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
      <header className="flex items-center justify-between gap-4">
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
      </header>

      <SelectionActionBar />

      <section className="flex flex-col gap-2 rounded-lg">
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
