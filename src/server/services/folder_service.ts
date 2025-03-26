"server only";
import type { Folder, Prisma } from "@prisma/client";
import { db } from "../db";
import { DriveService } from "./drive_service";

export class FolderService {
  private driveService: DriveService;

  constructor() {
    this.driveService = new DriveService();
  }

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

  search = async (query: string) => {
    try {
      const results = await db.$queryRaw`
        SELECT SIMILARITY(title, ${query}) AS score, "Folder".*
        FROM "Folder" WHERE SIMILARITY(title, ${query}) > 0.14
        ORDER BY score DESC LIMIT 40;`;

      return results as Folder[];
    } catch (error) {
      throw new Error(`Failed to search file: ${(error as Error).message}`);
    }
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

  update = async (id: number, updateData: Prisma.FolderUpdateInput) => {
    return await db.folder.update({ where: { id }, data: updateData });
  };

  delete = async (id: number) => {
    return await db.folder.delete({ where: { id } });
  };

  /**
   * Move a folder
   */
  moveFolder = async (googleId: string, newParentId: string) => {
    try {
      // Move in Drive
      await this.driveService.moveItem(googleId, newParentId);

      // Update in database
      const folder = await db.folder.update({
        where: { googleId },
        data: {
          parent: { connect: { googleId: newParentId } },
        },
      });

      return folder;
    } catch (error) {
      throw new Error(`Failed to move folder: ${(error as Error).message}`);
    }
  };
}

const folderService = new FolderService();
export default folderService;
