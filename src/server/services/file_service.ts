"server only";

import type { Prisma } from "@prisma/client";
import { db } from "../db";
import { DriveService } from "./drive_service";

export class FileService {
  private driveService: DriveService;

  constructor() {
    this.driveService = new DriveService();
  }

  findById = async (id: number) => {
    return await db.file.findUnique({
      where: { id },
      include: { folder: true },
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

  /**
   * Delete a file
   */
  deleteFile = async (googleId: string) => {
    try {
      // Delete from Drive
      await this.driveService.deleteItem(googleId);

      // Delete from database
      await db.file.delete({ where: { googleId } });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete file: ${(error as Error).message}`);
    }
  };

  /**
   * Rename a file
   */
  renameFile = async (googleId: string, newName: string) => {
    try {
      // Rename in Drive
      await this.driveService.renameItem(googleId, newName);

      // Update in database
      const file = await db.file.update({
        where: { googleId },
        data: { name: newName },
      });

      return file;
    } catch (error) {
      throw new Error(`Failed to rename file: ${(error as Error).message}`);
    }
  };

  search = async (payload: { query: string; tag?: string }) => {
    return await db.file.findMany({
      orderBy: {
        _relevance: {
          fields: ["name"],
          search: payload.query.replace(/\s+/g, " & "),
          sort: "desc",
        },
      },
      where: {
        ...(payload.tag && { tag: { name: payload.tag } }),
      },
      take: 25,
    });
  };

  /**
   * Move a file
   */
  moveFile = async (googleId: string, newFolderId: string) => {
    try {
      // Move in Drive
      await this.driveService.moveItem(googleId, newFolderId);

      // Update in database
      const file = await db.file.update({
        where: { googleId },
        data: {
          folder: { connect: { googleId: newFolderId } },
        },
      });

      return file;
    } catch (error) {
      throw new Error(`Failed to move file: ${(error as Error).message}`);
    }
  };
}

const fileService = new FileService();
export default fileService;
