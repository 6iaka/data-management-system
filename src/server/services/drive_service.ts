"server only";
import { google } from "googleapis";
import { env } from "~/env";

class DriveService {
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

  private drive = google.drive({
    version: "v2",
    auth: this.auth,
  });

  getAllFiles = async () => {
    const response = await this.drive.files.list({
      q: `'151uccR4uj_e_mAFGKGuPFDTCxI7Q9VrB' in parents`,
    });
    const files = response.data.items;
    if (!files) return [];
    return files;
  };

  getAllFolders = async () => {
    const response = await this.drive.files.list({
      q: `mimeType = 'application/vnd.google-apps.folder' and '151uccR4uj_e_mAFGKGuPFDTCxI7Q9VrB' in parents`,
    });
    const files = response.data.items;
    if (!files) return [];
    return files;
  };
}

const driveService = new DriveService();
export default driveService;
