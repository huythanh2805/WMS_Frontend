// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  taskAttachment: f({
    blob: { maxFileSize: "16MB", maxFileCount: 10 }, // cho PDF/DOC/OTHER
    image: { maxFileSize: "8MB", maxFileCount: 4 },
    video: { maxFileSize: "512MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File URL:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Helper map mimetype → enum (dùng ở NestJS callback hoặc đây)
export function getFileType(mime: string): "PDF" | "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER" {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime === "application/pdf") return "PDF";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime.includes("word") || mime.includes("excel") || mime.includes("text")) return "DOCUMENT";
  return "OTHER";
}