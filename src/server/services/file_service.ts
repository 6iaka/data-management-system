"server only";

import type { File as FileData, Prisma } from "@prisma/client";
import { db } from "../db";

export class FileService {
  /**
   * Find a file by ID
   * @param id ID of the file to be found
   * @returns Details of the file
   */
  findById = async (id: number) => {
    try {
      const file = await db.file.findUnique({
        where: { id },
        include: { folder: true, tag: true },
      });
      return file;
    } catch (error) {
      throw new Error(`Failed to find file: ${(error as Error).message}`);
    }
  };

  /**
   * Get Files From Folder
   * @param folderId ID of the folder to get the files from
   * @returns A list of files inside the folder
   */
  getFilesByFolder = async (folderId: number) => {
    try {
      const files = await db.file.findMany({
        orderBy: { createdAt: "desc" },
        include: { tag: true },
        where: { folderId },
      });
      return files;
    } catch (error) {
      throw new Error(
        `Failed to fetch files by folder: ${(error as Error).message}`,
      );
    }
  };

  /**
   * Get Files from the database
   * @returns List of the 30 latest files in the database
   */
  findMany = async () => {
    try {
      const files = await db.file.findMany({
        include: { tag: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      });
      return files;
    } catch (error) {
      throw new Error(`Failed to get all files: ${(error as Error).message}`);
    }
  };

  /**
   * Upsert a file to the database
   * @param insertData File creation parameters including metadata
   * @returns Created or Updated file
   */
  upsertFile = async (insertData: Prisma.FileCreateInput) => {
    try {
      return await db.file.upsert({
        where: { googleId: insertData.googleId },
        create: insertData,
        update: insertData,
      });
    } catch (error) {
      throw new Error(`Failded to upsert file: ${(error as Error).message}`);
    }
  };

  /**
   * Delete a file from the database
   * @param id ID of the file to be deleted
   * @returns Metadata of the deleted file
   */
  deleteFile = async (id: number) => {
    try {
      const deleted = await db.file.delete({ where: { id } });
      return deleted;
    } catch (error) {
      throw new Error(`Failed to delete file: ${(error as Error).message}`);
    }
  };

  /**
   * Search a file in the database based on a query
   * @param query Query parameter to search the file
   * @returns Array of results based on the query
   */
  search = async (query: string) => {
    // TO: CREATE EXTENSION IF NOT EXISTS pg_trgm;
    try {
      const results = await db.$queryRaw`
        SELECT GREATEST(SIMILARITY(title, ${query}), 
        SIMILARITY("originalFilename", ${query}),  
        SIMILARITY("description", ${query})) AS score, "File".*
        FROM "File" WHERE SIMILARITY(title, ${query}) > 0.14 
        OR SIMILARITY("originalFilename", ${query}) > 0.14 
        OR SIMILARITY("description", ${query}) > 0.14
        ORDER BY score DESC LIMIT 40;`;

      return results as FileData[];
    } catch (error) {
      throw new Error(`Failed to search file: ${(error as Error).message}`);
    }
  };
}

const fileService = new FileService();
export default fileService;
