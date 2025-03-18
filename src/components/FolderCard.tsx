"use client";
import type { Folder } from "@prisma/client";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
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

type Props = { data: Folder };

const FolderCard = ({ data }: Props) => {
  const router = useRouter();
  return (
    <Card
      className="group relative flex min-w-[200px] cursor-pointer items-center justify-between gap-2 p-2.5 transition-all hover:bg-secondary"
      onClick={() => router.push(`/folder/${data.id}`)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            variant={"outline"}
            className="absolute right-2 top-2 size-6"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Edit
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Folder</DialogTitle>
              </DialogHeader>
              <EditFolderForm id={data.id} />
            </DialogContent>
          </Dialog>

          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 48 48"
        className="size-14 transition-all group-hover:-translate-y-1"
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

      <div className="flex flex-1 flex-col">
        <h3 className="line-clamp-1 text-sm font-semibold">{data.name}</h3>
        <div className="flex items-center justify-between gap-2"></div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {data.description}
        </p>
      </div>
    </Card>
  );
};

export default FolderCard;
