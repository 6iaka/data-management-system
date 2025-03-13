"server only";

import type { Prisma } from "@prisma/client";
import { db } from "../db";

class FileService {
  upsert = async (insertData: Prisma.FileCreateInput) => {
    const upserted = await db.file.upsert({
      where: { googleId: insertData.googleId },
      create: insertData,
      update: insertData,
    });
    return upserted;
  };

  delete = async (id: number) => {
    const deleted = await db.file.delete({ where: { id } });
    return deleted;
  };
}

const fileService = new FileService();
export default fileService;
