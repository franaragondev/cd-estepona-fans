"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Uploader from "./Uploader";
import Modal from "./Modal";

interface Photo {
  id: string;
  url: string;
  albumId: string | null;
  caption?: string;
}

interface Album {
  id: string;
  title: string;
}

export default function GalleryAdmin() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;
  const [loading, setLoading] = useState(false);

  const [photoUrl, setPhotoUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");

  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalConfirmAction, setModalConfirmAction] = useState<
    (() => void) | null
  >(null);

  const [modalMode, setModalMode] = useState<"confirm" | "info">("confirm");

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/photos?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch photos");
      const data = await res.json();
      setPhotos(data.photos);
      setTotal(data.total);
      setSelectedPhotos(new Set());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchAlbums = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/albums");
      if (!res.ok) throw new Error("Failed to fetch albums");
      const data = await res.json();
      setAlbums(data.albums);
    } catch (error) {
      console.error(error);
    }
  }, [selectedAlbumId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  function toggleSelectPhoto(id: string) {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  function confirmDeleteSelected() {
    if (selectedPhotos.size === 0) {
      setModalMessage("No hay fotos seleccionadas para borrar.");
      setModalConfirmAction(null);
      setIsModalOpen(true);
      return;
    }
    setModalMessage(
      `¿Seguro que quieres borrar ${selectedPhotos.size} foto(s)?`
    );
    setModalConfirmAction(() => handleDeleteSelected);
    setModalMode("confirm");
    setIsModalOpen(true);
  }

  async function handleDeleteSelected() {
    try {
      const res = await fetch("/api/admin/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoIds: Array.from(selectedPhotos) }),
      });
      if (!res.ok) throw new Error("Error borrando las fotos");
      await fetchPhotos();
      setModalMessage("Fotos borradas correctamente.");
      setModalConfirmAction(null);
      setModalMode("info");
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      setModalMessage("Error borrando las fotos.");
      setModalConfirmAction(null);
      setModalMode("info");
      setIsModalOpen(true);
    }
  }

  async function handleUploadPhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!photoUrl.trim() || !selectedAlbumId) {
      setModalMessage("La URL y el álbum son obligatorios");
      setModalConfirmAction(null);
      setIsModalOpen(true);
      return;
    }
    try {
      const res = await fetch("/api/admin/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: photoUrl.trim(),
          caption: caption.trim(),
          albumId: selectedAlbumId,
        }),
      });
      if (!res.ok) throw new Error("Error subiendo foto");
      setPhotoUrl("");
      setCaption("");
      await fetchPhotos();
      setModalMessage("Foto subida correctamente");
      setModalConfirmAction(null);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      setModalMessage("Error subiendo foto");
      setModalConfirmAction(null);
      setIsModalOpen(true);
    }
  }

  function handleImageUpload() {
    fetchPhotos();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <form
        onSubmit={handleUploadPhoto}
        className="mb-8 space-y-4 bg-white p-6 rounded shadow"
      >
        <h2 className="font-semibold mb-2">Subir fotos</h2>

        <select
          value={selectedAlbumId}
          onChange={(e) => setSelectedAlbumId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>
            Selecciona un álbum
          </option>
          {albums
            .slice()
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(({ id, title }) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
        </select>

        <Uploader
          albumId={selectedAlbumId || "3"}
          onUploadComplete={handleImageUpload}
        />
      </form>

      {selectedPhotos.size > 0 && (
        <div className="mb-4">
          <button
            onClick={() => confirmDeleteSelected()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Borrar {selectedPhotos.size} foto(s) seleccionada(s)
          </button>
        </div>
      )}

      {loading ? (
        <p>Cargando fotos...</p>
      ) : photos.length === 0 ? (
        <p>No hay fotos.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map(({ id, url }) => (
              <div
                key={id}
                className="relative group border rounded overflow-hidden"
              >
                <label className="cursor-pointer block">
                  <input
                    type="checkbox"
                    checked={selectedPhotos.has(id)}
                    onChange={() => toggleSelectPhoto(id)}
                    className="hidden"
                  />

                  <Image
                    src={url}
                    alt={`Foto ${id}`}
                    width={400}
                    height={160}
                    className="object-cover w-full h-40"
                    priority={true}
                  />

                  <span className="absolute top-1 left-1 bg-white bg-opacity-75 rounded p-1 z-10 w-5 h-5 flex items-center justify-center pointer-events-none">
                    {selectedPhotos.has(id) && (
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={
          modalMode === "confirm"
            ? () => {
                if (modalConfirmAction) modalConfirmAction();
              }
            : undefined
        }
        message={modalMessage}
        title="Confirmación"
      />
    </div>
  );
}
