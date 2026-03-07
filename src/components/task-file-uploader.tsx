"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "@uploadthing/react"; // hoặc từ "react-dropzone" nếu muốn
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/utils/uploadthing"; // path của mày
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trash2, Upload, FileIcon, ImageIcon, FileVideo, FileText } from "lucide-react"; // icons từ lucide-react (shadcn thường có)

type FileWithPreview = File & { preview: string; typeCategory: "image" | "pdf" | "video" | "doc" | "other" };

export function TaskFileUploader({ taskId }: { taskId: string }) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload, routeConfig } = useUploadThing("taskAttachment", {
    onBeforeUploadBegin: (files) => {
      console.log("Preparing to upload:", files);
      return files;
    },
    onUploadProgress: (progress) => {
      console.log(`Upload progress: ${progress}%`);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : "";
      let typeCategory: FileWithPreview["typeCategory"] = "other";
      if (file.type.startsWith("image/")) typeCategory = "image";
      else if (file.type === "application/pdf") typeCategory = "pdf";
      else if (file.type.startsWith("video/")) typeCategory = "video";
      else if (file.type.includes("word") || file.type.includes("excel") || file.type.includes("pdf")) typeCategory = "doc";

      return Object.assign(file, { preview, typeCategory });
    });
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: generateClientDropzoneAccept(routeConfig), // tự động từ router config
    accept: {
      "image/*": [],
      "application/pdf": [],
      "video/*": [],
      // thêm tùy theo router config
    },
    disabled: isUploading,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const res = await startUpload(files); // upload thật lên UploadThing

      console.log("Uploaded:", res);

      // Gọi NestJS để lưu từng file vào Prisma
      for (const file of res || []) {
        await fetch("/api/files", { // hoặc endpoint NestJS của mày
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            url: file.url,
            type: getFileType(file.type), // hàm map mimetype → enum FileType
            taskId,
          }),
        });
      }

      // Clear sau upload thành công
      setFiles([]);
      alert("Upload và lưu thành công!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Lỗi upload: " + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview); // cleanup preview
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone area */}
        <div
          {...getRootProps()}
          className={`h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground transition-colors ${isDragActive ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input {...getInputProps()} />
          <p className="text-sm">Drag & drop files here or click to browse</p>
          <Button variant="link" className="mt-3 text-primary p-0 h-auto">
            + Add files
          </Button>
        </div>

        {/* Preview list */}
        {files.length > 0 && (
          <div className="space-y-3">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  {file.typeCategory === "image" && file.preview ? (
                    <img src={file.preview} alt={file.name} className="h-12 w-12 object-cover rounded" />
                  ) : file.typeCategory === "pdf" ? (
                    <FileText className="h-8 w-8 text-red-500" />
                  ) : file.typeCategory === "video" ? (
                    <FileVideo className="h-8 w-8 text-blue-500" />
                  ) : (
                    <FileIcon className="h-8 w-8 text-gray-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(idx)} disabled={isUploading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button (chỉ hiện khi có file) */}
        {files.length > 0 && (
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper map mimetype → enum (dùng ở NestJS callback hoặc đây)
function getFileType(mime: string): "PDF" | "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER" {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime === "application/pdf") return "PDF";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime.includes("word") || mime.includes("excel") || mime.includes("text")) return "DOCUMENT";
  return "OTHER";
}