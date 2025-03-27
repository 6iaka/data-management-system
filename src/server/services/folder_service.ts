"server only";
import type { Folder, Prisma } from "@prisma/client";
import { db } from "../db";

export class FolderService {
  /**
   * Find Many Folders
   * @param where Inputs to find the folders by
   * @returns Array of folders
   */
  findMany = async (where?: Prisma.FolderWhereInput) => {
    try {
      const folders = await db.folder.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        where,
      });
      return folders;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  /**
   * Find folder by ID
   * @param id ID of the folder to find
   * @returns folder details
   */
  findById = async (id: number) => {
    try {
      const folder = await db.folder.findUnique({
        where: { id },
        include: {
          files: true,
          children: true,
        },
      });
      return folder;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  /**
   * Find folder by googleId
   * @param googleId Google ID of the folder to find
   * @returns folder details
   */
  findByGoogleId = async (googleId: string) => {
    try {
      const folder = await db.folder.findUnique({ where: { googleId } });
      return folder;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  /**
   * Search folders
   * @param query Query to find the folders by
   * @returns List of folders
   */
  search = async (query: string) => {
    try {
      const results = await db.$queryRaw`
        SELECT GREATEST(SIMILARITY(title, ${query}), 
        SIMILARITY('description', ${query})) AS score, "Folder".*
        FROM "Folder" WHERE SIMILARITY(title, ${query}) > 0.04
        OR SIMILARITY('description', ${query}) > 0.04
        ORDER BY score DESC LIMIT 40;`;

      return results as Folder[];
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  /**
   * Upsert folder
   * @param insertData Data for folder creationg
   * @returns Upserted folder details
   */
  upsert = async (insertData: Prisma.FolderCreateInput) => {
    try {
      const folder = await db.folder.upsert({
        where: { googleId: insertData.googleId },
        create: insertData,
        update: insertData,
      });

      return folder;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  /**
   * Update folder
   * @param id Id of the folder to update
   * @param updateData Data to be updated
   * @returns Updated folder details
   */
  update = async (id: number, data: Prisma.FolderUpdateInput) => {
    try {
      const folder = await db.folder.update({
        where: { id },
        data,
      });

      return folder;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  /**
   * Delete folder
   * @param id ID of the folder to delete
   * @returns Deleted folder details
   */
  delete = async (id: number) => {
    try {
      const folder = await db.folder.delete({ where: { id } });
      return folder;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
}

const folderService = new FolderService();
export default folderService;
