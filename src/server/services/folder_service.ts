"server only";
import type { Prisma } from "@prisma/client";
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
   * Create a new folder
   */
  createFolder = async ({
    name,
    description,
    parentId,
    userClerkId,
  }: {
    name: string;
    description: string;
    parentId?: string;
    userClerkId: string;
  }) => {
    let driveFolder = null;

    try {
      // Create in Google Drive
      driveFolder = await this.driveService.createFolder(name, parentId);
      if (!driveFolder.id) throw new Error("Drive folder creation failed");

      // Create in database
      const folder = await db.folder.create({
        data: {
          parent: parentId ? { connect: { googleId: parentId } } : undefined,
          googleId: driveFolder.id,
          description,
          userClerkId,
          name,
        },
      });

      return folder;
    } catch (error) {
      // Rollback Drive folder creation if database fails
      if (driveFolder?.id) {
        await this.driveService.deleteItem(driveFolder.id);
      }
      throw error;
    }
  };

  /**
   * Delete a folder
   */
  deleteFolder = async (googleId: string) => {
    try {
      // Delete from Drive first
      await this.driveService.deleteItem(googleId);

      // Delete from database
      await db.folder.delete({ where: { googleId } });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete folder: ${(error as Error).message}`);
    }
  };

  /**
   * Rename a folder
   */
  renameFolder = async (googleId: string, newName: string) => {
    try {
      // Rename in Drive
      await this.driveService.renameItem(googleId, newName);

      // Update in database
      const folder = await db.folder.update({
        where: { googleId },
        data: { name: newName },
      });

      return folder;
    } catch (error) {
      throw new Error(`Failed to rename folder: ${(error as Error).message}`);
    }
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
