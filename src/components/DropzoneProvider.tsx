"use client";
import { useCallback, type ReactNode } from "react";
import { useDropzone } from "react-dropzone";

const DropzoneProvider = ({ children }: { children: ReactNode }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="flex h-full flex-col gap-4">
      {isDragActive ? (
        <div className="flex h-full flex-1 items-center justify-center rounded-md border-2 border-primary bg-secondary">
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#ffff"
              viewBox="0 0 24 24"
              className="size-24"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path>
              </g>
            </svg>

            <p>Drop files here to upload</p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default DropzoneProvider;
