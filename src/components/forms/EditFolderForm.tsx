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
import { editFolder } from "~/server/actions/folder_action";

const formSchema = z.object({
  title: z.string().trim(),
  description: z.string().optional(),
});

type Props = { id: number };

const EditFolderForm = ({ id }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await editFolder({ ...values, id });
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Rename</FormLabel>
              <FormControl>
                <Input placeholder="New folder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          Rename
        </Button>
      </form>
    </Form>
  );
};

export default EditFolderForm;
