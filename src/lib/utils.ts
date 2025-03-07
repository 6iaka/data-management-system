import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFileSize = (bytes: string | number | undefined) => {
  if (!bytes) return "0 Bytes";

  const b = parseInt(bytes.toString());
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (b === 0) return "0 Bytes";
  const i = parseInt(Math.floor(Math.log(b) / Math.log(1024)).toString());
  return `${(b / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};
