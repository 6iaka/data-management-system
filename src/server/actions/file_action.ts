"use server";

import { currentUser } from "@clerk/nextjs/server";
import type { Extension } from "@prisma/client";
import { revalidatePath } from "next/cache";
import driveService from "../services/drive_service";
import fileService from "../services/file_service";
import { getRootData } from "./drive_action";
import folderService from "../services/folder_service";

export const uploadFile = async ({
  files,
  folderId,
  tag,
}: {
  files: FileList;
  folderId?: number;
  tag: string;
}) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");

    if (!tag || tag.trim() === "") throw new Error("Tag is required");

    const rootFolderId = folderId
      ? (await folderService.findById(folderId))?.googleId
      : (await getRootData())?.rootFolder.id;
    if (!rootFolderId) return null;

    const driveFile = await driveService.uploadFile({
      folderId: rootFolderId,
      file: files[0]!,
    });
    if (!driveFile.id) throw new Error("GoogleId is not found");
    console.log(driveFile);

    try {
      if (!driveFile.fileExtension)
        throw new Error("fileExtension is not found");
      if (!driveFile.mimeType) throw new Error("mimetype is not found");
      if (!driveFile.fileSize) throw new Error("fileSize is not found");
      if (!driveFile.embedLink) throw new Error("embedLink is not found");
      if (!driveFile.webContentLink)
        throw new Error("webContentLink is not found");
      if (!driveFile.title) throw new Error("title is not found");

      const newFile = await fileService.upsert({
        name: driveFile.title,
        userClerkId: user.id,
        fileExtension: driveFile.fileExtension as Extension,
        folder: { connect: { googleId: rootFolderId } },
        googleId: driveFile.id,
        mimeType: driveFile.mimeType,
        size: Number(driveFile.fileSize),
        url: driveFile.embedLink,
        previewLink: driveFile.thumbnailLink,
        tag: { connect: { name: tag } },
      });

      console.log("File created with success", newFile.id);

      revalidatePath("/");
      revalidatePath("/folder/:id", "page");
    } catch (error) {
      await driveService.deleteItem(driveFile.id);
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};
