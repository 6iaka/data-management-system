"server only";
import type { Prisma } from "@prisma/client";
import { db } from "../db";

class FolderService {
  findById = async (id: number) => {
    return await db.folder.findUnique({
      where: { id },
      include: {
        files: true,
        children: true,
      },
    });
  };

  getRootData = async () => {
    return await db.folder.findFirst({
      where: { isRoot: true },
      include: {
        files: true,
        children: true,
      },
    });
  };

  findByGoogleId = async (googleId: string) => {
    return await db.folder.findUnique({ where: { googleId } });
  };

  getAll = async () => {
    return await db.folder.findMany();
  };

  upsert = async (insertData: Prisma.FolderCreateInput) => {
    return await db.folder.upsert({
      where: { googleId: insertData.googleId },
      create: insertData,
      update: insertData,
    });
  };

  delete = async (id: number) => {
    return await db.folder.delete({ where: { id } });
  };
}

const folderService = new FolderService();
export default folderService;
