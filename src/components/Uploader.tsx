"use client";

import React, { useState, useRef } from "react";

interface UploaderProps {
  albumId: string;
  title?: string;
  content?: string;
  slug?: string;
  onUploadComplete: (data: { urls: string[]; files: File[] }) => void;
}

export default function Uploader({
  albumId,
  title,
  content,
  slug,
  onUploadComplete,
}: UploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleClickDropArea = () => {
    fileInputRef.current?.click();
  };

  async function handleUpload() {
    if (files.length === 0) return;

    setUploading(true);
    setTotal(files.length);
    setRemaining(files.length);

    const formData = new FormData();

    formData.append("albumId", albumId);
    formData.append("title", title ?? "");
    formData.append("content", content ?? "");
    formData.append("slug", slug ?? "");

    files.forEach((file) => formData.append("file", file));

    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", "/api/upload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round(
            (event.loaded / event.total) * 100
          );
          setRemaining(total - Math.floor((percentCompleted / 100) * total));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          const urls = data.images.map((img: { url: string }) => img.url);
          onUploadComplete({ urls, files });
          setUploading(false);
          setRemaining(null);
          setTotal(0);
          setFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          resolve();
        } else {
          console.error("La subida ha fallado");
          setUploading(false);
          setRemaining(null);
          setTotal(0);
          reject();
        }
      };

      xhr.onerror = () => {
        console.error("Error durante la subida");
        setUploading(false);
        setRemaining(null);
        setTotal(0);
        reject();
      };

      xhr.send(formData);
    });
  }

  const progress =
    remaining !== null && total > 0
      ? Math.round(((total - remaining) / total) * 100)
      : 0;

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 px-4 py-8">
      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClickDropArea}
      >
        <p className="text-gray-600">Arrastra y suelta tus imágenes aquí</p>
        <p className="text-sm text-gray-400">
          o haz clic para seleccionar archivos
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          name="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <ul className="text-sm text-gray-700 space-y-1">
          {files.map((file, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span>• {file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(idx)}
                className="text-red-500 hover:underline text-xs ml-2"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="w-full max-w-md py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Subiendo..." : "Subir imágenes"}
      </button>

      {uploading && (
        <div className="w-full max-w-md mt-4">
          <div className="w-full bg-gray-200 h-4 rounded overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">
            {remaining === 0
              ? "Finalizando..."
              : `${remaining} archivo(s) restantes... (${progress}%)`}
          </p>
        </div>
      )}
    </div>
  );
}
