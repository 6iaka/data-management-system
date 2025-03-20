"use server";

import { currentUser } from "@clerk/nextjs/server";
import folderService from "../services/folder_service";
import { getRootData } from "./drive_action";
import { z } from "zod";
import driveService from "../services/drive_service";
import { revalidatePath } from "next/cache";

export const createRootFolder = async () => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not autorized");

    const data = await getRootData();
    if (!data) throw new Error("Root folder data not found");

    const rootFolder = data.rootFolder;
    if (!rootFolder.id) throw new Error("No GoogleID found");

    const folderExists = await folderService.findByGoogleId(rootFolder.id);
    if (folderExists) throw new Error("Root folder already exists");

    const folder = await folderService.upsert({
      googleId: rootFolder.id,
      userClerkId: user.id,
      name: "Root",
      description: "Main folder of the project.",
      isRoot: true,
    });

    console.log("Root folder created", folder.id);
  } catch (error) {
    console.error(error);
  }
};

export const createNewFolder = async (payload: {
  name: string;
  description: string;
  parentId?: number;
}) => {
  const schema = z.object({
    name: z
      .string()
      .min(1, "Folder name is required")
      .max(255, "Folder name cannot exceed 255 characters")
      .regex(/^[^<>:"/\\|?*]+$/, {
        message: "Folder name contains invalid characters",
      })
      .trim(),
    parentId: z.coerce.number().optional(),
    description: z
      .string()
      .min(10, "Description should be at least 10 characters")
      .max(1000, "Description cannot exceed 1000 characters"),
  });

  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");
    const valid = schema.parse(payload);

    const rootFolderId = valid.parentId
      ? (await folderService.findById(valid.parentId))?.googleId
      : (await getRootData())?.rootFolder.id;
    if (!rootFolderId) return null;

    const driveFolder = await driveService.createFolder(
      valid.name,
      rootFolderId,
    );
    if (!driveFolder.id) throw new Error("Folder GoogleId not found");

    try {
      const newFolder = await folderService.upsert({
        description: valid.description,
        name: valid.name,
        googleId: driveFolder.id,
        userClerkId: user.id,
        parent: { connect: { googleId: rootFolderId } },
      });

      console.log("Folder created with success", newFolder.id);

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
  name: string;
  description: string;
}) => {
  const schema = z.object({
    id: z.coerce.number().min(1),
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

  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");
    const valid = schema.parse(payload);

    const newFolder = await folderService.update(valid.id, {
      description: valid.description,
      name: valid.name,
    });

    await driveService.renameItem(newFolder.googleId, payload.name);
    console.log("Folder created with success", newFolder.id);

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
