"use client";

import React, { useState, useRef } from "react";

export default function Page() {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setTotal(files.length);
    setRemaining(files.length);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          const url = Array.isArray(data.url) ? data.url[0] : data.url;
          uploadedUrls.push(url);
        } else {
          console.error("Upload failed for file:", file.name);
        }
      } catch (err) {
        console.error("Error uploading:", err);
      }

      setRemaining((prev) => (prev !== null ? prev - 1 : null));
    }

    setUploading(false);
    setRemaining(null);
    setTotal(0);
    setFiles([]);
  }

  const progress =
    remaining !== null && total > 0
      ? Math.round(((total - remaining) / total) * 100)
      : 0;

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center gap-6 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="w-full max-w-md flex flex-col gap-4"
      >
        <div
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleClickDropArea}
        >
          <p className="text-gray-600">Drag & drop your images here</p>
          <p className="text-sm text-gray-400">or click to select files</p>
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
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploading && (
        <div className="w-full max-w-md">
          <div className="w-full bg-gray-200 h-4 rounded overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">
            {remaining === 0
              ? "Finalizing..."
              : `${remaining} file(s) remaining... (${progress}%)`}
          </p>
        </div>
      )}
    </div>
  );
}
