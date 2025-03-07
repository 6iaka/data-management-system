import { Table } from "lucide-react";
import FolderCard from "~/components/FolderCard";
import TooltipWrapper from "~/components/TooltipWrapper";
import { Button } from "~/components/ui/button";
import driveService from "~/server/services/drive_service";

const HomePage = async () => {
  const files = await driveService.getAllFiles();
  return (
    <main className="flex flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Root Folder</h2>

        <div className="flex gap-2">
          <Button size={"sm"}>Add File</Button>
          <Button size={"sm"} variant={"secondary"}>
            New Folder
          </Button>
        </div>
      </header>

      <section className="flex flex-col gap-1.5 rounded-lg">
        <h3 className="text-balance font-medium">Folders</h3>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
          {files.map((item) => (
            <FolderCard key={item.id} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-1.5 rounded-lg">
        <h3 className="text-balance font-medium">Recent Files</h3>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4"></div>
      </section>

      <section className="flex flex-col gap-1.5 rounded-lg">
        <header className="flex items-center justify-between">
          <h3 className="text-balance font-medium">Files</h3>

          <TooltipWrapper label="Change Display">
            <Button variant={"ghost"} size={"icon"}>
              <Table />
            </Button>
          </TooltipWrapper>
        </header>

        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4"></div>
      </section>
    </main>
  );
};

export default HomePage;
