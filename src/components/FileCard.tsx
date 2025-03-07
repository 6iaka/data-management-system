import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const FileCard = () => {
  return (
    <Link href={"/"} title="Name of the file">
      <Card className="hover:bg-secondary group relative flex flex-col items-center justify-center gap-4 p-4 transition-all">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="absolute right-2 top-2 size-7"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Bookmark</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div>
          <Image
            src={"/filetype-jpg.svg"}
            className="size-14 transition-all group-hover:-translate-y-1"
            unoptimized
            height={40}
            width={40}
            alt=""
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground line-clamp-1 text-xs">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur id
            laborum, mollitia iusto vero nihil et ad est, ratione odit quo
            dolorem! Quos temporibus deserunt quasi tempore dolorem, ullam iste!
          </p>

          <div className="flex items-center justify-between gap-4 text-xs">
            <p>150 MB</p>
            <p>12.07.2025</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default FileCard;
