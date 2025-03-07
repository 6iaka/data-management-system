"use server";

import folderService from "../services/folder_service";

export const getAllFolders = async (parentId?: number) => {
  const folders = await folderService.getAll(parentId);
  return folders;
};
