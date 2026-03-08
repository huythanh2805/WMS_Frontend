"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/utils/uploadthing";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trash2, FileIcon, FileVideo, FileText } from "lucide-react";
import { getFileType } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { FindAllResponse, useApi } from "@/hooks/use-api";
import type { File as FileType } from "@/types"
import Image from "next/image";

type FileWithPreview = File & { preview: string; typeCategory: "image" | "pdf" | "video" | "doc" | "other" };

export function TaskFileUploader({ taskId, projectId }: { taskId: string, projectId: string }) {
  const { loading, request } = useApi<FileType>()
  const { loading: isFilesLoading, request: isFileRequest } = useApi<FindAllResponse<FileType>>()
  const [filesPreview, setFilesPreview] = useState<FileWithPreview[]>([]);
  const [files, setFiles] = useState<FileType[]>([])
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("taskAttachment", {
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
    setFilesPreview((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "video/*": [],
    },
    disabled: isUploading,
  });

  const handleUpload = async () => {
    if (filesPreview.length === 0) return;

    setIsUploading(true);
    try {
      const res = await startUpload(filesPreview); // upload thật lên UploadThing

      // Gọi NestJS để lưu từng file vào Prisma
      for (const file of res || []) {
        await request({
          url: "/file",
          method: "post",
          data: {
            name: file?.name,
            size: file?.size,
            url: file?.url,
            type: getFileType(file?.type), // hàm map mimetype → enum FileType
            taskId,
            projectId
          }
        }, {
          onSuccess: (data) => {
            setFiles([data.data, ...files])
            setFilesPreview([])
            toast.success("Upload và lưu thành công!");
          }
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload error: " + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFilesPreview((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview); 
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  // Fetching files by taskId
  const fetchFilesByTaskId = async () => {
    await isFileRequest({
      url: `/file/task/${taskId}`,
      method: "get",
    }, {
      onSuccess: (data) => {
        setFiles(data.data.items)
      }
    })
  }
  useEffect(() => {
    if (taskId) fetchFilesByTaskId()
  }, [taskId])
  // Combine files in database and preview files into one array to rander UI
  const allFiles = useMemo(() => {
    const previewFiles = filesPreview.map((f) => ({
      name: f.name,
      size: f.size,
      preview: f.preview,
      typeCategory: f.typeCategory,
      isUploaded: false,
      isFilePreView: true
    }))
    const uploadedFiles = files.map((f) => ({
      id: f.id,
      name: f.name,
      url: f.url,
      preview: f.url,
      typeCategory: f.type?.toLowerCase() || "file",
      isUploaded: true,
      size: f?.size || 0,
      isFilePreView: false

    }))

    return [...previewFiles, ...uploadedFiles]
  }, [filesPreview, files])
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
        {allFiles.length > 0 && (
          <div className="space-y-3">
            {allFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  {file.typeCategory === "image" && file.preview ? (
                    <Image src={file?.preview} alt={file?.name} width={48} height={48} className="h-12 w-12 object-cover rounded" />
                  ) : file.typeCategory === "pdf" ? (
                    <FileText className="h-8 w-8 text-red-500" />
                  ) : file.typeCategory === "video" ? (
                    <FileVideo className="h-8 w-8 text-blue-500" />
                  ) : (
                    <FileIcon className="h-8 w-8 text-gray-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{((file?.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {
                  file.isFilePreView && (
                    <Button variant="ghost" size="icon" onClick={() => removeFile(idx)} disabled={isUploading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )
                }
              </div>
            ))}
          </div>
        )}

        {/* Upload button (chỉ hiện khi có file) */}
        {filesPreview.length > 0 && (
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : `Upload ${filesPreview.length} file${filesPreview.length > 1 ? "s" : ""}`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

