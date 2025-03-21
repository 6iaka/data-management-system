import { Download, ExternalLink, Move, Trash, X } from "lucide-react";
import { useSelection } from "~/hooks/use-selection";
import { Button } from "./ui/button";

const SelectionActionBar = () => {
  const { items, resetItems } = useSelection((state) => state);
  if (items.length > 0)
    return (
      <div className="flex items-center gap-4 rounded-full bg-secondary/50 p-1 text-sm">
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
            <ExternalLink />
          </Button>

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
};

export default SelectionActionBar;
