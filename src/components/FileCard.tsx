import type { File } from "@prisma/client";
import { EllipsisVertical } from "lucide-react";
import { Card } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatFileSize } from "~/lib/utils";
import DynamicImage from "./DynamicImage";
import { Button } from "./ui/button";

type Props = { file: File };

const FileCard = ({ file }: Props) => {
  return (
    <a target="_blank" href={file.url} title={file.name}>
      <Card className="group relative flex flex-col items-center justify-center gap-4 p-4 transition-all hover:bg-secondary">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              className="absolute right-2 top-2 z-20 size-6"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* {file?.previewLink ? (
          <div className="h-14 w-full overflow-hidden rounded-md">
            <Image
              src={file?.previewLink || "/"}
              className="size-full object-cover object-center transition-all group-hover:scale-105"
              unoptimized
              height={40}
              width={40}
              alt=""
            />
          </div>
        ) : (
        )} */}
        <DynamicImage fileExtension={file.fileExtension} />

        <div className="flex w-full flex-col gap-1">
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {file.name}
          </p>

          <div className="flex items-center justify-between gap-4 text-xs">
            <p>{formatFileSize(file.size || 0)}</p>
            <p>{new Date(file.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>
    </a>
  );
};

// <a target="_blank" href={file.embedLink || "/"} title={file?.title || ""}>
// <Card className="group relative flex flex-col items-center justify-center gap-4 p-4 transition-all hover:bg-secondary">
//   <DropdownMenu>
//     <DropdownMenuTrigger asChild>
//       <Button
//         size={"icon"}
//         variant={"ghost"}
//         className="absolute right-2 top-2 size-7"
//       >
//         <EllipsisVertical />
//       </Button>
//     </DropdownMenuTrigger>
//     <DropdownMenuContent align="end">
//       <DropdownMenuItem>Bookmark</DropdownMenuItem>
//       <DropdownMenuItem>Edit</DropdownMenuItem>
//       <DropdownMenuItem>Delete</DropdownMenuItem>
//     </DropdownMenuContent>
//   </DropdownMenu>

//   <DynamicImage fileExtension={file.fileExtension || "raw"} />

//   <div className="flex flex-col gap-1">
//     <p className="line-clamp-1 text-xs text-muted-foreground">
//       {file?.title}
//     </p>

//     <div className="flex items-center justify-between gap-4 text-xs">
//       <p>{formatFileSize(file?.fileSize || 0)}</p>
//       <p>
//         {file?.createdDate &&
//           new Date(file.createdDate).toLocaleDateString()}
//       </p>
//     </div>
//   </div>
// </Card>
// </a>
export default FileCard;
