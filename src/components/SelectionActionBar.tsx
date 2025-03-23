"use client";
import { Download, Move, Trash, X } from "lucide-react";
import { useSelection } from "~/hooks/use-selection";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

const SelectionActionBar = () => {
  const { items, resetItems } = useSelection((state) => state);

  if (items.length > 0)
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-4 rounded-full bg-secondary/50 p-1 text-sm"
      >
        <Button
          variant={"ghost"}
          size={"icon"}
          className="size-7 rounded-full"
          onClick={resetItems}
        >
          <X />
        </Button>

        <p>{items.length} selected</p>

        <div className="flex gap-1">
          <Button
            className="size-7 rounded-full"
            variant={"ghost"}
            size={"icon"}
          >
            <Download />
          </Button>

          <Button
            className="size-7 rounded-full"
            variant={"ghost"}
            size={"icon"}
          >
            <Move />
          </Button>

          <Button
            className="size-7 rounded-full"
            variant={"ghost"}
            size={"icon"}
          >
            <Trash />
          </Button>
        </div>
      </div>
    );
  else
    return (
      <div className="flex gap-2">
        <Select>
          <SelectTrigger className="w-72">Type</SelectTrigger>
          <SelectContent>
            <SelectItem value="documents">Documents</SelectItem>
            <SelectItem value="spreadsheets">Spreadsheets</SelectItem>
            <SelectItem value="presentations">Presentations</SelectItem>
            <SelectItem value="images">Photos & Images</SelectItem>
            <SelectItem value="pdfs">PDFs</SelectItem>
            <SelectItem value="videos">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-72">Tags</SelectTrigger>
          <SelectContent>
            <SelectItem value="tag1">Tag 1</SelectItem>
            <SelectItem value="tag2">Tag 2</SelectItem>
            <SelectItem value="tag3">Tag 3</SelectItem>
            <SelectItem value="tag4">Tag 4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
};

export default SelectionActionBar;
