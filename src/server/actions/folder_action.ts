"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import driveService from "../services/drive_service";
import folderService from "../services/folder_service";

export const getAllFolders = async () => {
  return await folderService.getAll();
};

export const getFolderDetails = async (id: number) => {
  return await folderService.findById(id);
};

export const createRootFolder = async () => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not autorized");

    const folder = await folderService.upsert({
      description: "Main folder of the project.",
      userClerkId: user.id,
      googleId: "root",
      title: "Root",
      isRoot: true,
    });
  } catch (error) {
    return {};
  }
};

export const createNewFolder = async (payload: {
  title: string;
  description?: string;
  parentId?: number;
}) => {
  const schema = z.object({
    title: z.string().trim(),
    parentId: z.coerce.number().optional(),
    description: z.string().optional(),
  });

  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");
    const valid = schema.parse(payload);

    const rootFolderId = valid.parentId
      ? (await folderService.findById(valid.parentId))?.googleId
      : undefined;

    const driveFolder = await driveService.createFolder(
      valid.title,
      rootFolderId,
    );
    if (!driveFolder.id) throw new Error("Folder GoogleId not found");

    try {
      await folderService.upsert({
        description: valid.description,
        title: valid.title,
        googleId: driveFolder.id,
        userClerkId: user.id,
        parent: { connect: { googleId: rootFolderId } },
      });

      revalidatePath("/");
      revalidatePath("/folder/:id", "page");
    } catch (error) {
      await driveService.deleteItem(driveFolder.id);
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

export const editFolder = async (payload: {
  id: number;
  title: string;
  description?: string;
}) => {
  const schema = z.object({
    id: z.coerce.number().min(1),
    title: z.string().trim(),
    description: z.string().optional(),
  });

  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");
    const valid = schema.parse(payload);

    const newFolder = await folderService.update(valid.id, {
      description: valid.description,
      title: valid.title,
    });

    await driveService.renameItem(newFolder.googleId, payload.title);

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");
  } catch (error) {
    console.error(error);
  }
};

export const deleteFolder = async (id: number) => {
  const deleted = await folderService.delete(id);
  await driveService.deleteItem(deleted.googleId);
  revalidatePath("/");
  revalidatePath("/folder/:id", "page");
};

export const searchFolder = async (query: string) => {
  return await folderService.search(query);
};
