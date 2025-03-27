"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import driveService from "../services/drive_service";
import fileService from "../services/file_service";
import folderService from "../services/folder_service";

export const getFiles = async (folderId: number) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");

    const files = await fileService.findByFolderId(folderId);

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");

    return files;
  } catch (error) {
    console.error((error as Error).message);
  }
};

export const uploadFiles = async ({
  files,
  folderId,
}: {
  files: File[];
  folderId?: number;
}) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");

    const uploadPromise = files.map(async (file) => {
      const uploaded = await uploadFile({ file, folderId });
      return uploaded;
    });

    const upload = await Promise.allSettled(uploadPromise);
    const results = upload.map((item) => {
      if (item.status === "rejected") {
        return { success: false, error: item.reason as string };
      } else {
        return { success: false, data: item.value };
      }
    });

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");

    return results;
  } catch (error) {
    console.error((error as Error).message);
  }
};

type UploadType = {
  file: File;
  folderId?: number | null;
  tagName?: string;
  description?: string;
};

export const uploadFile = async (payload: UploadType) => {
  let driveFileId = "";
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");

    const folderId = payload.folderId
      ? (await folderService.findById(payload.folderId))?.googleId
      : (await driveService.getRootFolder()).id;
    if (!folderId) throw new Error("Failed to retrieve folderId");

    const driveFile = await driveService.uploadFile({
      description: payload.description,
      file: payload.file,
      folderId,
    });
    if (!driveFile.id) throw new Error("Failed to retrieve file google data");
    driveFileId = driveFile.id;

    const newFile = await fileService.upsert({
      ...(payload.tagName && { tag: { connect: { name: payload.tagName } } }),
      iconLink: driveFile.iconLink!.replace("16", "64"),
      folder: { connect: { googleId: folderId } },
      originalFilename: driveFile.originalFilename!,
      webContentLink: driveFile.webContentLink!,
      fileExtension: driveFile.fileExtension!,
      thumbnailLink: driveFile.thumbnailLink,
      webViewLink: driveFile.webViewLink!,
      fileSize: Number(driveFile.size),
      description: payload.description,
      mimeType: driveFile.mimeType!,
      googleId: driveFile.id,
      title: driveFile.name!,
      userClerkId: user.id,
    });

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");

    return newFile;
  } catch (error) {
    await driveService.deleteItem(driveFileId);
    console.error((error as Error).message);
  }
};

export const deleteFiles = async (ids: number[]) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");

    const deletePromise = ids.map(async (id) => {
      return await deleteFile(id);
    });
    const deleted = await Promise.allSettled(deletePromise);

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");

    return deleted;
  } catch (error) {
    console.error((error as Error).message);
  }
};

export const deleteFile = async (id: number) => {
  try {
    const deletedFile = await fileService.delete(id);
    await driveService.deleteItem(deletedFile.googleId);
    return deletedFile;
  } catch (error) {
    console.error((error as Error).message);
  }
};

export const searchFile = async (query: string) => {
  try {
    const results = await fileService.search(query);
    return results;
  } catch (error) {
    console.error((error as Error).message);
  }
};
