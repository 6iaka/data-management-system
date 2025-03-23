"use client";
import { useQuery } from "@tanstack/react-query";
import { Folder, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSelection } from "~/hooks/use-selection";
import { getFolderDetails } from "~/server/actions/folder_action";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";

const DetailsSidebar = () => {
  const { items, setIsOpen } = useSelection((state) => state);

  const { data } = useQuery({
    queryKey: ["get-folder-details", items[0]?.id],
    queryFn: async () => await getFolderDetails(items[0]!.id),
    enabled: !!items[0]?.id,
  });

  const [description, setDescription] = useState("");

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex min-w-[300px] flex-col overflow-y-auto rounded-2xl bg-secondary/20"
    >
      <header className="flex items-center justify-between gap-2 border-b p-4">
        <div className="flex items-center gap-2 text-sm">
          <Folder className="fill-primary" />
          <p>{data?.title || "Sodexo Drive"}</p>
        </div>

        <Button
          size={"icon"}
          variant={"ghost"}
          className="size-6 rounded-full"
          onClick={() => setIsOpen(false)}
        >
          <X />
        </Button>
      </header>

      {items.length === 1 ? (
        <div className="flex flex-col gap-4 p-4">
          <h4>Folder details</h4>

          <div>
            <small>Type</small>
            <div>Google Drive Folder</div>
          </div>

          <div>
            <small>Owner</small>
            <div>Lamine</div>
          </div>

          <div>
            <small>Modified</small>
            <div>Sep 3, 2023 by me</div>
          </div>

          <div>
            <small>Created</small>
            <div>Sep 3, 2023</div>
          </div>

          <div className="flex flex-col gap-1">
            <small>Description</small>
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.currentTarget.value);
              }}
              placeholder="Add description"
            ></Textarea>
            <div className="w-full text-right text-xs">
              {description.length}/23500
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 text-balance text-center">
          <Image src={"/filetype-raw.svg"} alt="" width={64} height={64} />
          <p className="text-sm text-muted-foreground">
            {items.length
              ? 1 && `${items.length} items selected`
              : "Select an item to see the details"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailsSidebar;
