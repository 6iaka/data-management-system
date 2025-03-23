"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import driveService from "../services/drive_service";
import fileService from "../services/file_service";
import folderService from "../services/folder_service";
import type { File as FileData } from "@prisma/client";

type ReturnType<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export const uploadFile = async ({
  files,
  folderId,
  tagName,
  description,
}: {
  files: FileList;
  folderId?: number;
  tagName?: string;
  description?: string;
}): Promise<ReturnType<FileData>> => {
  let driveFileId: string = "";

  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");

    const rootFolderId = folderId
      ? (await folderService.findById(folderId))?.googleId
      : undefined;

    const driveFile = await driveService.uploadFile({
      folderId: rootFolderId,
      file: files[0]!,
      onProgress: (progress) => {
        // Update UI with progress
        console.log(
          `Upload ${(progress.bytesRead / progress.totalBytes) * 100}%`,
        );
      },
    });
    driveFileId = driveFile.id!;

    const newFile = await fileService.upsertFile({
      ...(tagName && { tag: { connect: { name: tagName } } }),
      iconLink: driveFile.iconLink?.replace("16", "64")!,
      folder: { connect: { googleId: rootFolderId } },
      originalFilename: driveFile.originalFilename!,
      webContentLink: driveFile.webContentLink!,
      fileExtension: driveFile.fileExtension!,
      thumbnailLink: driveFile.thumbnailLink,
      fileSize: Number(driveFile.fileSize),
      downloadUrl: driveFile.downloadUrl!,
      md5Checksum: driveFile.md5Checksum!,
      embedLink: driveFile.embedLink!,
      mimeType: driveFile.mimeType!,
      selfLink: driveFile.selfLink!,
      version: driveFile.version!,
      title: driveFile.title!,
      googleId: driveFile.id!,
      userClerkId: user.id,
      description,
    });

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");

    return { success: true, data: newFile };
  } catch (error) {
    // Drive clean up
    if (driveFileId) {
      try {
        await driveService.deleteItem(driveFileId);
      } catch (deleteError) {
        console.error("Failed to cleanup drive file:", deleteError);
      }
    }

    // Error handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("File upload failed:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const deleteFile = async (id: number): Promise<ReturnType<FileData>> => {
  try {
    const deletedFile = await fileService.deleteFile(id);
    await driveService.deleteItem(deletedFile.googleId);

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");

    return { success: true, data: deletedFile };
  } catch (error) {
    // Error handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("File upload failed:", errorMessage);

    return { success: false, error: errorMessage };
  }
};

export const searchFile = async (
  query: string,
): Promise<ReturnType<FileData[]>> => {
  try {
    const results = await fileService.searchFile(query);
    return { success: true, data: results };
  } catch (error) {
    // Error handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("File upload failed:", errorMessage);

    return { success: false, error: errorMessage };
  }
};
