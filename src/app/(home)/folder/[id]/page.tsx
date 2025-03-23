import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DropzoneProvider from "~/components/DropzoneProvider";
import FileCard from "~/components/FileCard";
import FolderCard from "~/components/FolderCard";
import CreateFolderForm from "~/components/forms/CreateFolderForm";
import FileUploadForm from "~/components/forms/FileUploadForm";
import SelectionActionBar from "~/components/SelectionActionBar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import driveService from "~/server/services/drive_service";
import folderService from "~/server/services/folder_service";

type Props = { params: Promise<{ id: string }> };

const FolderPage = async ({ params }: Props) => {
  const id = Number((await params).id);
  if (isNaN(id)) notFound();

  const data = await folderService.findById(id);
  if (!data) notFound();

  const folders = await driveService.getFolderDetails(data.googleId);

  return (
    <>
      {JSON.stringify(folders)}

      <header className="flex flex-col gap-2">
        <div className="flex flex-1 items-start justify-between gap-2">
          {data.parentId ? (
            <Button variant={"outline"} asChild>
              <Link href={`/folder/${data.parentId}`}>
                <ChevronLeft />
                Back
              </Link>
            </Button>
          ) : (
            <Button variant={"ghost"} className="rounded-full" asChild>
              <Link href={"/"}>
                <ChevronLeft />
                Dashboard
              </Link>
            </Button>
          )}

          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size={"sm"} className="rounded-full">
                  Upload File
                </Button>
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
                <Button
                  size={"sm"}
                  className="rounded-full"
                  variant={"secondary"}
                >
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
        </div>

        <h2 className="text-xl font-bold">{data.title}</h2>
      </header>

      <SelectionActionBar />

      <DropzoneProvider>
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
          <h3 className="text-balance font-medium">Files</h3>

          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2">
            {data.files.length > 0 ? (
              data.files.map((item) => <FileCard data={item} key={item.id} />)
            ) : (
              <p className="text-sm text-muted-foreground">No Files Here</p>
            )}
          </div>
        </section>
      </DropzoneProvider>
    </>
  );
};

export default FolderPage;
