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
    // .middleware(async ({ req, res }) => {
    //   // Auth check (chạy trên server Next.js)
    //   const user = auth(req);
    //   if (!user) throw new UploadThingError("Unauthorized");

    //   // Trả metadata về client (sẽ dùng trong onUploadComplete)
    //   return { userId: user.userId };
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      // Callback này chạy server-side sau khi upload xong
      // Gọi NestJS API để lưu vào Prisma
      // console.log("Upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// Helper để map mimetype → enum FileType
function getFileTypeFromMime(mime: string): "PDF" | "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER" {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime === "application/pdf") return "PDF";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime.includes("word") || mime.includes("excel") || mime.includes("powerpoint") || mime.includes("text/")) {
    return "DOCUMENT";
  }
  return "OTHER";
}