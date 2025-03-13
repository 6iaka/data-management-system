"use client";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { Input } from "~/components/ui/input";
import { uploadFile } from "~/server/actions/file_action";

const formSchema = z.object({
  name: z.string(),
  location: z.string(),
  tags: z.string().array(),
  folderId: z.string().optional(),
  userClerkId: z.string(),
  files: z.instanceof(FileList),
});

type Props = { folderId?: string };

const FileUploadForm = ({ folderId }: Props) => {
  const { user } = useUser();
  if (!user) notFound();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: [],
      name: "",
      userClerkId: "",
      location: "",
    },
  });
  const fileRef = form.register("files");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await uploadFile({
      files: values.files,
      folderId,
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
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
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Folder Name</FormLabel>
              <FormControl>
                <Input placeholder="Type here..." {...field} />
              </FormControl>
              <FormDescription>
                Choose a clear and descriptive name for your folder
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Create
        </Button>
      </form>
    </Form>
  );
};

export default FileUploadForm;
