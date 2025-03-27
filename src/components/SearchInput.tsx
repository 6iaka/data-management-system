"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "./ui/label";
import { useSearchParams } from "next/navigation";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  return (
    <form action={"/search"} className="relative">
      <Button
        type="submit"
        size={"icon"}
        variant={"ghost"}
        className="absolute left-2 top-1/2 size-8 -translate-y-1/2 rounded-full [&_svg]:size-4"
      >
        <Search />
      </Button>

      <Input
        name="query"
        defaultValue={query}
        placeholder="Search in Drive"
        className="h-11 rounded-full px-12"
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="absolute right-2 top-1/2 size-8 -translate-y-1/2 rounded-full [&_svg]:size-4"
          >
            <SlidersHorizontal />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advance Search</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>File type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select the type of the file" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="photos">Photos & Images</SelectItem>
                  <SelectItem value="pdf">PDFs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Item name</Label>
              <Input placeholder="Enter a term that matches part of the file name" />
            </div>

            <div className="flex flex-col gap-2">
              <Label>File tag</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select the tag that the file should contain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="photos">Photos & Images</SelectItem>
                  <SelectItem value="pdf">PDFs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="ml-auto flex">
            <Button className="rounded-full" variant={"ghost"}>
              Reset
            </Button>
            <Button className="rounded-full">Search</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default SearchInput;
