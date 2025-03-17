import { ChevronLeft, Table } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import FileCard from "~/components/FileCard";
import FolderCard from "~/components/FolderCard";
import CreateFolderForm from "~/components/forms/CreateFolderForm";
import FileUploadForm from "~/components/forms/FileUploadForm";
import TooltipWrapper from "~/components/TooltipWrapper";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import folderService from "~/server/services/folder_service";

type Props = { params: Promise<{ id: string }> };

const FolderPage = async ({ params }: Props) => {
  const id = Number((await params).id);
  if (isNaN(id)) notFound();

  const data = await folderService.findById(id);
  if (!data) notFound();

  return (
    <main className="flex flex-col gap-4 p-4">
      <header className="flex items-end justify-between gap-2">
        <div className="flex min-w-[200px] flex-1 flex-col items-start justify-end gap-2">
          {data.parentId && (
            <Button variant={"ghost"} asChild>
              <Link href={`/folder/${data.parentId}`}>
                <ChevronLeft />
                Back
              </Link>
            </Button>
          )}

          <h2 className="text-xl font-bold">{data.name}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"}>Upload File</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
              </DialogHeader>
              <FileUploadForm folderId={id} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} variant={"secondary"}>
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new folder</DialogTitle>
              </DialogHeader>
              <CreateFolderForm parentId={id} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <section className="flex flex-col gap-2 rounded-lg">
        <h3 className="text-balance font-medium">Folders</h3>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
          {data.children.length > 0 ? (
            data.children.map((item) => (
              <FolderCard data={item} key={item.id} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No Folders Here</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-2 rounded-lg">
        <header className="flex items-center justify-between">
          <h3 className="text-balance font-medium">Files</h3>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="images">Photos & Images</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="pdfs">PDFs</SelectItem>
              </SelectContent>
            </Select>

            <TooltipWrapper label="Change Display">
              <Button variant={"ghost"} size={"icon"}>
                <Table />
              </Button>
            </TooltipWrapper>
          </div>
        </header>

        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2">
          {data.files.length > 0 ? (
            data.files.map((item) => <FileCard file={item} key={item.id} />)
          ) : (
            <p className="text-sm text-muted-foreground">No Files Here</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default FolderPage;
