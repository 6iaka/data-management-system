import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DropzoneProvider from "~/components/DropzoneProvider";
import FileCard from "~/components/FileCard";
import FolderCard from "~/components/FolderCard";
import CreateFolderForm from "~/components/forms/CreateFolderForm";
import FileUploadForm from "~/components/forms/FileUploadForm";
import { Button } from "~/components/ui/button";
import { findFolderById } from "~/server/actions/folder_action";

type Props = { params: Promise<{ id: string }> };

const FolderPage = async ({ params }: Props) => {
  const id = Number((await params).id);
  if (isNaN(id)) notFound();

  const data = await findFolderById(id);
  if (!data) notFound();

  return (
    <>
      <header className="flex flex-col gap-2 p-4 pb-0">
        <div className="flex flex-1 items-start justify-between gap-2">
          {data.parentId ? (
            <Button variant={"secondary"} className="rounded-full" asChild>
              <Link href={`/folder/${data.parentId}`}>
                <ChevronLeft />
                Back
              </Link>
            </Button>
          ) : (
            <Button variant={"secondary"} className="rounded-full" asChild>
              <Link href={"/"}>
                <ChevronLeft />
                Dashboard
              </Link>
            </Button>
          )}

          <div className="flex flex-wrap gap-2">
            <FileUploadForm folderId={id} />
            <CreateFolderForm parentId={id} />
          </div>
        </div>
        <h2 className="text-xl font-bold capitalize">{data.title}</h2>
      </header>

      <DropzoneProvider
        folderId={id}
        className="flex h-full flex-1 flex-col gap-4 overflow-y-auto p-4"
      >
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
