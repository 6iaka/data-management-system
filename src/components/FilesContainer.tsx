"use client";

import { useQuery } from "@tanstack/react-query";
import { getFiles } from "~/server/actions/file_action";
import FileCard from "./FileCard";

type Props = { folderId: number };

const FilesContainer = ({ folderId }: Props) => {
  const { data: response } = useQuery({
    queryKey: [`getFiles`, folderId],
    queryFn: async () => await getFiles(folderId),
  });

  if (response?.success)
    return (
      <section className="flex flex-col gap-2 rounded-lg">
        <h3 className="text-balance font-medium">Files</h3>

        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2">
          {response.data.length > 0 ? (
            response.data.map((item) => <FileCard data={item} key={item.id} />)
          ) : (
            <p className="text-sm text-muted-foreground">No Files Here</p>
          )}
        </div>
      </section>
    );
};

export default FilesContainer;
