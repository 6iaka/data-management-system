"server only";
import { google } from "googleapis";
import { Readable } from "stream";
import { env } from "~/env";

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
    onProgress,
  }: {
    file: File;
    folderId?: string;
    onProgress?: (event: { bytesRead: number; totalBytes: number }) => void;
  }) => {
    try {
      if (!file) throw new Error("No file provided");

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const stream = Readable.from(buffer);

      const fileMetadata = {};
      const media = {
        body: stream,
        mimeType: file.type,
        chunkSize: 256 * 1024,
      };

      const totalBytes = file.size;
      const response = await this.drive.files.create(
        {
          requestBody: {
            // title: file.name,
            // parents: folderId ? [{ id: folderId }] : [{ id: "root" }],
            mimeType: file.type,
            name: file.name,
          },
          supportsAllDrives: true,
          uploadType: "multipart",
          media: {
            mimeType: file.type,
            body: stream,
          },
        },
        {
          onUploadProgress: (e) => {
            onProgress?.({
              bytesRead: e.bytesRead,
              totalBytes,
            });
          },
          retry: true,
          retryConfig: {
            retry: 3,
            onRetryAttempt: (err) => {
              console.log("Retrying upload after error:", err);
            },
          },
          maxRedirects: 0,
          maxContentLength: Infinity,
        },
      );

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

  createFolder = async (name: string, parentId?: string) => {
    try {
      const fileMetadata = {
        title: name,
        mimeType: "application/vnd.google-apps.folder",
        parents: parentId ? [{ id: parentId }] : [{ id: "root" }],
      };

      const response = await this.drive.files.insert({
        requestBody: fileMetadata,
        fields: "id,title,mimeType,parents",
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
        fields: "items(id,title,parents,mimeType)",
      });

      const folders = response.data.items ?? [];

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
      // fields: "items(id,title,mimeType,fileSize)",
    });
    const data = response.data.items ?? [];

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
    const response = await this.drive.files.get({
      fileId: id,
    });
    const folder = response.data;
    return folder;

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

        const title = folder.data.title;
        const parentId = folder.data.parents?.[0]?.id;

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

  /**
   * Move a file or folder
   */
  moveItem = async (fileId: string, newParentId: string) => {
    try {
      // Remove from current parent and add to new parent
      const response = await this.drive.files.patch({
        fileId,
        removeParents: "root", // Will remove from all current parents
        addParents: newParentId,
        fields: "id, parents",
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
      const response = await this.drive.files.patch({
        fileId,
        requestBody: {
          title: newName,
        },
        fields: "id,title",
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
