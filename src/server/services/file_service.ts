"server only";

import type { Prisma } from "@prisma/client";
import { db } from "../db";

class FileService {
  findById = async (id: number) => {
    return await db.file.findUnique({
      where: { id },
      include: {
        tags: true,
        folder: true,
      },
    });
  };

  getAll = async () => await db.file.findMany();

  upsert = async (insertData: Prisma.FileCreateInput) => {
    return await db.file.upsert({
      where: { googleId: insertData.googleId },
      create: insertData,
      update: insertData,
    });
  };

  delete = async (id: number) => {
    const deleted = await db.file.delete({ where: { id } });
    return deleted;
  };
}

const fileService = new FileService();
export default fileService;
