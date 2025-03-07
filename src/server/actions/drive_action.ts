"use server";

import { revalidatePath } from "next/cache";
import driveService from "../services/drive_service";
import { z } from "zod";

export const getRootData = async () => {
  const rootFolder = await driveService.getRootFolder();

  if (!rootFolder) return null;
  if (!rootFolder.id) return null;

  const contents = await driveService.getFolderContent(rootFolder.id);
  return { rootFolder, contents };
};

export const createNewFolder = async (payload: {
  folderName: string;
  parentId?: string;
}) => {
  const schema = z.object({
    folderName: z.string().min(2, {
      message: "Folder name must be at least 2 characters.",
    }),
    parentId: z.string().optional(),
  });
  const valid = schema.parse(payload);

  if (valid.parentId) {
    await driveService.createFolder(valid.folderName, valid.parentId);
  } else {
    const rootFolder = await driveService.getRootFolder();

    if (!rootFolder) return null;
    if (!rootFolder.id) return null;

    await driveService.createFolder(valid.folderName, rootFolder.id);
  }

  revalidatePath("/");
  revalidatePath("/folder/:id", "page");
};
