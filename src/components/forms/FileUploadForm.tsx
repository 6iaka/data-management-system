"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import Dropzone, { DropzoneState } from "shadcn-dropzone";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useToast } from "~/hooks/use-toast";
import { uploadFile } from "~/server/actions/file_action";
import { getAllTags } from "~/server/actions/tag_action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  file: z.instanceof(File),
  tagName: z.string().optional(),
  description: z.string().min(1).optional(),
});

type Props = { folderId?: number };

const FileUploadForm = ({ folderId }: Props) => {
  const { toast } = useToast();

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => await getAllTags(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tagName: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await uploadFile({
      description: values.description,
      tagName: values.tagName,
      file: values.file,
      folderId,
    });

    if (!response.success) {
      toast({
        title: "Error",
        description: response.error,
      });
    } else {
      toast({
        title: "Success",
        description: `File uploaded GoogleID: ${response.data.googleId}`,
      });
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          name="file"
          control={form.control}
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>File</FormLabel>
              <FormControl>
                <Dropzone
                  multiple={false}
                  dropZoneClassName="h-[150px]"
                  onDrop={(acceptedFiles: File[]) => {
                    const file = acceptedFiles[0]!;
                    form.setValue("file", file);
                  }}
                >
                  {(dropzone: DropzoneState) => (
                    <div className="flex flex-col items-center p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffff"
                        viewBox="0 0 24 24"
                        className="size-10"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path>
                        </g>
                      </svg>

                      <small className="text-xs">
                        {dropzone.isDragAccept
                          ? ` Drop your File here!`
                          : `${dropzone.acceptedFiles.length} File Uploaded`}
                      </small>
                    </div>
                  )}
                </Dropzone>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagName"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tag (Optional)</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tags?.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormDescription>
                This tag will be used to organize the files. Please create new
                ones if neccessary.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add a description" {...field}></Textarea>
              </FormControl>
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
