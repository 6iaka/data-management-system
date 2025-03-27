"server only";
import { type drive_v3, google } from "googleapis";
import { Readable } from "stream";
import { env } from "~/env";
import { getRootData } from "../actions/drive_action";

export class DriveService {
  private auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: env.GOOGLE_PROJECT_ID,
      private_key_id: env.GOOGLE_PRIVATE_KEY_ID,
      private_key: env.GOOGLE_PRIVATE_KEY,
      client_email: env.GOOGLE_CLIENT_EMAIL,
      client_id: env.GOOGLE_CLIENT_ID,
      universe_domain: "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  private drive = google.drive({ version: "v3", auth: this.auth });

  /**
   * Upload a file to Google Drive
   * @param params Upload parameters including file data and metadata
   * @returns Uploaded file metadata
   */
  uploadFile = async ({
    file,
    folderId,
    description,
  }: {
    file: File;
    folderId?: string;
    description?: string;
  }) => {
    try {
      if (!file) throw new Error("No file provided");

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const stream = Readable.from(buffer);

      const parentId = folderId || (await getRootData())?.id || "root";

      const response = await this.drive.files.create({
        requestBody: {
          parents: [parentId],
          description: description,
          mimeType: file.type,
          name: file.name,
        },
        supportsAllDrives: true,
        uploadType: "resumable",
        media: {
          mimeType: file.type,
          body: stream,
        },
        fields: "*",
      });

      await this.drive.permissions.create({
        fileId: response.data.id!,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
  };

  createFolder = async (payload: {
    title: string;
    parentId?: string;
    description?: string;
  }) => {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: payload.title,
          parents: [payload.parentId || "root"],
          mimeType: "application/vnd.google-apps.folder",
          description: payload.description,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw new Error("Failed to create folder");
    }
  };

  getRootFolder = async () => {
    try {
      const response = await this.drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.folder'",
        fields: "*",
      });

      const folders = response.data.files ?? [];

      const rootFolder = folders.find(
        (folder) => !folder.parents || folder.parents.length === 0,
      );

      if (!rootFolder) return null;

      return rootFolder;
    } catch (error) {
      console.error("Error getting root folders:", error);
      return null;
    }
  };

  getFolderContent = async (folderId: string) => {
    const response = await this.drive.files.list({
      q: `'${folderId}' in parents`,
    });
    const data = response.data.files ?? [];

    const contents = {
      folders: data.filter(
        (item) => item.mimeType === "application/vnd.google-apps.folder",
      ),
      files: data.filter(
        (item) => item.mimeType !== "application/vnd.google-apps.folder",
      ),
    };

    return contents;
  };

  getFolderDetails = async (id: string) => {
    const response = await this.drive.files.get({ fileId: id });
    const folder = response.data;

    if (!folder.id) return null;

    const parents = await this.getFolderPath(folder.id);
    const contents = await this.getFolderContent(folder.id);

    return { folder, parents, contents };
  };

  getFolderPath = async (folderId: string) => {
    const path: { id: string; title: string }[] = [];
    let currentId = folderId;

    while (currentId) {
      try {
        const folder = await this.drive.files.get({
          fileId: currentId,
          fields: "parents,title",
        });

        const title = folder.data.name;
        const parentId = folder.data.parents?.[0];
        if (!parentId) break;

        path.unshift({ id: currentId, title: title ?? "Unknown" });
        currentId = parentId;
      } catch (error) {
        console.error("Error getting folder:", error);
        break;
      }
    }

    return path;
  };

  getAllFiles = async () => {
    const folder = await this.drive.files.list();
    return folder.data.files;
  };

  search = async (query: string) => {
    try {
      const response = await this.drive.files.list({
        q: `(name contains '${query}' or description contains '${query}')`,
        fields: "files(id, name, description, mimeType)",
      });

      const files: drive_v3.Schema$File[] = [];
      const folders: drive_v3.Schema$File[] = [];

      response?.data?.files?.forEach((file) => {
        if (file.mimeType === "application/vnd.google-apps.folder") {
          folders.push(file);
        } else {
          files.push(file);
        }
      });

      return { files, folders };
    } catch (error) {
      console.error(error);
      throw new Error(`Search failed ${(error as Error).message}`);
    }
  };

  /**
   * Move a file or folder
   */
  moveItem = async (fileId: string, newParentId: string) => {
    try {
      const response = await this.drive.files.update({
        removeParents: "root",
        addParents: newParentId,
        fileId,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to move item: ${(error as Error).message}`);
    }
  };

  /**
   * Rename a file or folder
   */
  renameItem = async (fileId: string, newName: string) => {
    try {
      const response = await this.drive.files.update({
        requestBody: { name: newName },
        fileId,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to rename item: ${(error as Error).message}`);
    }
  };

  /**
   * Delete a file or folder
   */
  deleteItem = async (fileId: string) => {
    try {
      await this.drive.files.delete({ fileId });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete item: ${(error as Error).message}`);
    }
  };
}

const driveService = new DriveService();
export default driveService;
