"use server";

import driveService from "../services/drive_service";

export const getRootData = async () => {
  const rootFolder = await driveService.getRootFolder();
  if (!rootFolder?.id) return null;
  const contents = await driveService.getFolderContent(rootFolder.id);
  return { ...rootFolder, contents };
};
