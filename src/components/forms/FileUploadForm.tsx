"use client";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { uploadFile } from "~/server/actions/file_action";
import { getAllTags } from "~/server/actions/tag_action";

const formSchema = z.object({
  files: z.instanceof(FileList),
  tag: z.string().min(1),
});

type Props = { folderId?: number };

const FileUploadForm = ({ folderId }: Props) => {
  const { data } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => await getAllTags(),
  });

  const { user } = useUser();
  if (!user) notFound();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tag: "" },
  });
  const fileRef = form.register("files");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await uploadFile({
      files: values.files,
      tag: values.tag,
      folderId,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          name="files"
          control={form.control}
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input type="file" placeholder="Upload a file" {...fileRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tag</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? data?.find((tag) => tag.name === field.value)?.name
                        : "Select tag"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-[--radix-popover-trigger-width] flex-1 p-0">
                  <Command>
                    <CommandInput placeholder="Search tag..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No Tags found.</CommandEmpty>
                      <CommandGroup>
                        {data?.map((tag) => (
                          <CommandItem
                            value={tag.name}
                            key={tag.name}
                            onSelect={() => {
                              form.setValue("tag", tag.name);
                            }}
                          >
                            {tag.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                tag.name === field.name
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This tag will be used to organize the files. Please create new
                ones if neccessary.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Upload
        </Button>
      </form>
    </Form>
  );
};

export default FileUploadForm;
