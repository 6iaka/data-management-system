"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import driveService from "../services/drive_service";
import fileService from "../services/file_service";
import folderService from "../services/folder_service";
import type { File as FileData } from "@prisma/client";

export const uploadFiles = async ({
  files,
  folderId,
}: {
  files: File[];
  folderId?: number | null;
}): Promise<ApiResponse<any>> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");

    const uploadPromise = files.map(async (file) => {
      const uploaded = uploadFile({ file, folderId });
      return uploaded;
    });
    const upload = await Promise.allSettled(uploadPromise);
    const results = upload.map((item) => {
      if (item.status === "rejected") {
        return { success: false, error: item.reason };
      } else {
        return { success: false, data: item.value };
      }
    });

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");

    return { success: true, data: results };
  } catch (error) {
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

export const uploadFile = async ({
  file,
  folderId,
  tagName,
  description,
}: {
  file: File;
  folderId?: number | null;
  tagName?: string;
  description?: string;
}): Promise<ApiResponse<FileData>> => {
  let driveFileId: string = "";

  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");

    const rootFolderId = folderId
      ? (await folderService.findById(folderId))?.googleId
      : undefined;

    const driveFile = await driveService.uploadFile({
      folderId: rootFolderId,
      file: file,
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
      webViewLink: driveFile.webViewLink!,
      fileSize: Number(driveFile.size),
      mimeType: driveFile.mimeType!,
      title: driveFile.name!,
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

export const deleteFiles = async (ids: number[]): Promise<ApiResponse<any>> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authorized");

    const deletePromise = ids.map(async (id) => {
      const deleted = deleteFile(id);
      return deleted;
    });
    const deleted = await Promise.allSettled(deletePromise);
    const results = deleted.map((item) => {
      if (item.status === "rejected") {
        return { success: false, error: item.reason };
      } else {
        return { success: false, data: item.value };
      }
    });

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");

    return { success: true, data: results };
  } catch (error) {
    // Error handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("File upload failed:", errorMessage);

    return { success: false, error: errorMessage };
  }
};

export const deleteFile = async (
  id: number,
): Promise<ApiResponse<FileData>> => {
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
): Promise<ApiResponse<FileData[]>> => {
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
