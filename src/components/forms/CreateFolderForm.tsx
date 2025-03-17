"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { createNewFolder } from "../../server/actions/folder_action";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(255, "Folder name cannot exceed 255 characters")
    .regex(/^[^<>:"/\\|?*]+$/, {
      message: "Folder name contains invalid characters",
    })
    .trim(),

  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});

type Props = { parentId?: number };

const CreateFolderForm = ({ parentId }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createNewFolder({
      description: values.description,
      name: values.name,
      parentId,
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
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Folder Name</FormLabel>
              <FormControl>
                <Input placeholder="Folder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field}></Textarea>
              </FormControl>
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

export default CreateFolderForm;
