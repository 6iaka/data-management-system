"server only";

import type { Prisma } from "@prisma/client";
import { db } from "../db";

class TagService {
  getAll = async () => await db.tag.findMany();

  upsert = async (insertData: Prisma.TagCreateInput) => {
    return await db.tag.upsert({
      where: { name: insertData.name },
      create: insertData,
      update: insertData,
    });
  };
}

const tagService = new TagService();
export default tagService;
