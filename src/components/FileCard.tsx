"use client";
import type { File as FileData } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { EllipsisVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, formatFileSize } from "~/lib/utils";
import { deleteFile } from "~/server/actions/file_action";
import { Button } from "./ui/button";

type Props = { data: FileData };

const FileCard = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => await deleteFile(data.id),
  });

  return (
    <a
      href={data.webViewLink}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2.5 rounded-lg bg-card p-4 transition-all hover:bg-secondary/25",
        isPending && "pointer-events-none opacity-20",
      )}
      onDoubleClick={() => (window.location.href = data.webViewLink)}
    >
      <DropdownMenu defaultOpen={isOpen} onOpenChange={setIsOpen} open={isOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="absolute right-2 top-2 z-20 size-6 rounded-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <EllipsisVertical />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={data.webContentLink} download>
              Download
            </a>
          </DropdownMenuItem>
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
                <AlertDialogAction
                  onClick={() => {
                    setIsOpen(false);
                    mutate();
                  }}
                >
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

      <div className="flex w-full select-none flex-col leading-[.5]">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
          {data.title}
        </p>
        <small className="text-xs font-light">
          {formatFileSize(data.fileSize)}
        </small>
      </div>
    </a>
  );
};

export default FileCard;
