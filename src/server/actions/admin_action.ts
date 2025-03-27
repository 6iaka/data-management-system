"use server";

import { currentUser } from "@clerk/nextjs/server";
import Limit from "p-limit";
import { getCategoryFromMimeType } from "~/lib/utils";
import driveService from "../services/drive_service";
import fileService from "../services/file_service";
import folderService from "../services/folder_service";
import { revalidatePath } from "next/cache";
const limit = Limit(10);

export const syncDrive = async () => {
  const user = await currentUser();

  try {
    if (!user) throw new Error("Not authorized");
    const items = await driveService.getAllItems();
    if (!items) throw new Error("Failed to retrieve google drive files");

    await Promise.allSettled(
      items.map((item) =>
        limit(async () => {
          const isFolder =
            item.mimeType === "application/vnd.google-apps.folder";

          if (isFolder) {
            return await folderService.upsert({
              parent: { connect: { googleId: item.parents![0]! } },
              description: item.description,
              userClerkId: user.id,
              googleId: item.id!,
              title: item.name!,
            });
          } else {
            const mimeType = item.mimeType!;
            const category = getCategoryFromMimeType(mimeType);
            if (!category) throw new Error("Unrecognized File Type");

            return await fileService.upsert({
              folder: { connect: { googleId: item.parents![0]! } },
              iconLink: item.iconLink!.replace("16", "64"),
              originalFilename: item.originalFilename!,
              webContentLink: item.webContentLink!,
              fileExtension: item.fileExtension!,
              thumbnailLink: item.thumbnailLink,
              webViewLink: item.webViewLink!,
              description: item.description,
              fileSize: Number(item.size),
              mimeType: item.mimeType!,
              userClerkId: user.id,
              categeory: category,
              googleId: item.id!,
              title: item.name!,
            });
          }
        }),
      ),
    );

    revalidatePath("/");
    revalidatePath("/folder/:id", "page");
  } catch (error) {
    console.error((error as Error).message);
  }
};
