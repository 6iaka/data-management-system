"server only";

import type { Prisma } from "@prisma/client";
import { db } from "../db";

class FolderService {
  findById = async (id: number) => {
    const folder = await db.folder.findUnique({ where: { id } });
    return folder;
  };

  getAll = async (parentId?: number) => {
    const folders = await db.folder.findMany({
      ...(parentId && { where: { parentId } }),
    });
    const filtered = folders.filter((item) => !item.isRoot);
    return filtered;
  };

  upsert = async (insertData: Prisma.FolderCreateInput) => {
    const upserted = await db.folder.upsert({
      where: { googleId: insertData.googleId },
      create: insertData,
      update: insertData,
    });
    return upserted;
  };

  delete = async (id: number) => {
    const deleted = await db.folder.delete({ where: { id } });
    return deleted;
  };
}

const folderService = new FolderService();
export default folderService;
