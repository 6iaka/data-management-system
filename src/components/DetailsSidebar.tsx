"use client";
import { useQuery } from "@tanstack/react-query";
import { Folder } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSelection } from "~/hooks/use-selection";
import { getFolderDetails } from "~/server/actions/folder_action";
import { Textarea } from "./ui/textarea";

const DetailsSidebar = () => {
  const { items } = useSelection((state) => state);
  const [description, setDescription] = useState("");

  const { data } = useQuery({
    queryKey: ["get-folder-details", items[0]?.id],
    queryFn: async () => await getFolderDetails(items[0]!.id),
    enabled: !!items[0]?.id,
  });

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className="flex h-full flex-col rounded-2xl bg-secondary/20"
    >
      {items.length === 1 && (
        <div>
          <header className="flex items-center gap-2 border-b p-4 text-sm">
            <Folder />
            <p>{data?.name}</p>
          </header>

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
        </div>
      )}
      {items.length > 1 && <div>Multiple helloes</div>}
      {items.length < 1 && (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 text-balance text-center">
          <Image src={"/filetype-raw.svg"} alt="" width={64} height={64} />
          <p className="text-sm text-muted-foreground">
            Select an item to see the details
          </p>
        </div>
      )}
    </aside>
  );
};

export default DetailsSidebar;
