import { Table } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import FileCard from "~/components/FileCard";
import FolderCard from "~/components/FolderCard";
import TooltipWrapper from "~/components/TooltipWrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import driveService from "~/server/services/drive_service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import CreateFolderForm from "~/components/forms/CreateFolderForm";

type Props = {
  params: Promise<{ id: string }>;
};

const FolderPage = async ({ params }: Props) => {
  const id = (await params).id;
  const data = await driveService.getFolderDetails(id);
  if (!data) notFound();

  return (
    <main className="flex flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold">{data.folder.title} Folder</h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/`}>Root</BreadcrumbLink>
              </BreadcrumbItem>
              {data.parents.map((item) => (
                <React.Fragment key={item.id}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/folder/${item.id}`}>
                      {item.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex gap-2">
          <Button size={"sm"}>Add File</Button>

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
          {data.contents.folders.length > 0 ? (
            data.contents.folders.map((item) => (
              <FolderCard id={item.id} name={item.title} key={item.id} />
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
          {data.contents.files.length > 0 ? (
            data.contents.files.map((item) => <FileCard key={item.id} />)
          ) : (
            <p className="text-sm text-muted-foreground">No Files Here</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default FolderPage;
