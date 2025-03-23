"use client";
import type { File } from "@prisma/client";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Card } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSelection } from "~/hooks/use-selection";
import { cn, formatFileSize } from "~/lib/utils";
import { deleteFile } from "~/server/actions/file_action";
import { Button } from "./ui/button";

type Props = { data: File };

const FileCard = ({ data }: Props) => {
  const router = useRouter();
  const { toggleSelect, items } = useSelection((state) => state);
  const isSelected = items.find((item) => item.googleId === data.googleId);

  return (
    <Card
      className={cn(
        "group relative flex flex-col items-center gap-2.5 p-4 transition-all hover:bg-secondary/25",
        isSelected && "bg-[#2D336B] hover:bg-[#2D336B]",
      )}
      onDoubleClick={() => router.push(`/folder/${data.id}`)}
      onClick={(e) => {
        e.stopPropagation();
        toggleSelect({ googleId: data.googleId, id: data.id, type: "file" });
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="absolute right-2 top-2 z-20 size-6 rounded-full"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your file and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteFile(data.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="shrink-0">
        <Image
          src={data.iconLink}
          className="size-12 transition-all group-hover:-translate-y-1"
          unoptimized
          height={40}
          width={40}
          alt=""
        />
      </div>

      <div className="flex w-full select-none flex-col gap-1">
        <p className="line-clamp-1 text-xs">{data.title}</p>
        <small className="text-xs font-light">
          {formatFileSize(data.fileSize)}
        </small>
      </div>
    </Card>
  );
};

export default FileCard;
