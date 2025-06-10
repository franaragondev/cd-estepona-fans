"use client";

import React, { useState } from "react";

export default function RegisterPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      const urls = Array.isArray(data.url) ? data.url : [data.url];
      setImageUrls(urls);
    } else {
      console.log("Error uploading");
    }
  }

  return (
    <div className="min-h-screen">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" name="file" accept="image/*" multiple required />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {imageUrls.length > 0 && (
        <>
          <h2>Uploaded Images</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {imageUrls.map((url, i) => (
              <img
                key={i}
                src={url.replace("/upload/", "/upload/f_auto,q_auto/")}
                alt={`Uploaded ${i + 1}`}
                style={{ maxWidth: "300px" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
