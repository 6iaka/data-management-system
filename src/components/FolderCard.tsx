"use client";
import type { Folder } from "@prisma/client";
import { Download, Edit, EllipsisVertical, Move, Trash } from "lucide-react";
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
import { cn } from "~/lib/utils";
import { deleteFolder } from "~/server/actions/folder_action";
import EditFolderForm from "./forms/EditFolderForm";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSelection } from "~/hooks/use-selection";

type Props = { data: Folder };

const FolderCard = ({ data }: Props) => {
  const router = useRouter();
  const { toggleSelect, items } = useSelection((state) => state);
  const isSelected = items.find((item) => item.googleId === data.googleId);

  return (
    <Card
      className={cn(
        "group relative flex items-center gap-2.5 p-2 transition-all hover:bg-secondary/25",
        isSelected && "bg-[#2D336B] hover:bg-[#2D336B]",
      )}
      onDoubleClick={() => router.push(`/folder/${data.id}`)}
      onClick={(e) => {
        e.stopPropagation();
        toggleSelect({ googleId: data.googleId, id: data.id, type: "folder" });
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 48 48"
        className="size-12 flex-shrink-0 transition-all group-hover:-translate-y-1"
      >
        <path
          fill="#FFA000"
          d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z"
        ></path>
        <path
          fill="#FFCA28"
          d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z"
        ></path>
      </svg>

      <div className="pointer-events-none flex flex-1 select-none flex-col">
        <h3 className="line-clamp-1 text-sm font-semibold">{data.title}</h3>
        <p className="line-clamp-1 text-xs font-light">{data.description}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="size-6 shrink-0 rounded-full"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-44"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Download /> Download
          </DropdownMenuItem>

          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit /> Rename
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename</DialogTitle>
              </DialogHeader>
              <EditFolderForm id={data.id} />
            </DialogContent>
          </Dialog>

          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Move /> Move To
          </DropdownMenuItem>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash /> Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your folder and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteFolder(data.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export default FolderCard;
