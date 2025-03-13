"use server";

import driveService from "../services/drive_service";

export const uploadFile = async (payload: {
  files: FileList;
  folderId?: string;
}) => {
  const rootFolderId =
    payload.folderId || (await driveService.getRootFolder())?.id;
  if (!rootFolderId) return null;

  await driveService.uploadFile({
    files: payload.files,
    folderId: rootFolderId,
  });
};
