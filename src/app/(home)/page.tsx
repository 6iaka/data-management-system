import { Table } from "lucide-react";
import FileCard from "~/components/FileCard";
import FolderCard from "~/components/FolderCard";
import TooltipWrapper from "~/components/TooltipWrapper";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import driveService from "~/server/services/drive_service";

const HomePage = async () => {
  const folders = await driveService.getAllFolders();

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

      <section className="flex flex-col gap-2 rounded-lg">
        <h3 className="text-balance font-medium">Folders</h3>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
          {folders.map((item) => (
            <FolderCard name={item.title} key={item.id} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2 rounded-lg">
        <h3 className="text-balance font-medium">Recent Files</h3>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2"></div>
      </section>

      <section className="flex flex-col gap-2 rounded-lg">
        <header>
          <div className="flex items-center justify-between">
            <h3 className="text-balance font-medium">Files</h3>

            <TooltipWrapper label="Change Display">
              <Button variant={"ghost"} size={"icon"}>
                <Table />
              </Button>
            </TooltipWrapper>
          </div>

          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="max-w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="images">Photos & Images</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="pdfs">PDFs</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="max-w-[300px]">
                <SelectValue placeholder="People" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pridila">pridila.2006@gmail.com</SelectItem>
                <SelectItem value="siaka">siakadiarra7@gmail.com</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2">
          {folders.map((item) => (
            <FileCard key={item.id} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
