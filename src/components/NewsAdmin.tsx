"use client";

import React, { useEffect, useState } from "react";
import Uploader from "./Uploader";
import Modal from "./Modal";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  authorId: string;
  createdAt: Date;
}

interface NewsAdminProps {
  name: string;
  id: string;
}

const initialFormState = {
  id: "",
  title: "",
  slug: "",
  content: "",
  image: "",
  authorId: "",
};

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewsAdmin({ name, id }: NewsAdminProps) {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [form, setForm] = useState({ ...initialFormState, authorId: id });
  const [isEditing, setIsEditing] = useState(false);
  const [skip, setSkip] = useState(0);
  const take = 9;
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [modal, setModal] = useState<{
    message: string;
    title?: string;
    confirm?: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setForm((f) => ({ ...f, authorId: id }));
    }
  }, [id, isEditing]);

  async function fetchNews() {
    const res = await fetch(`/api/admin/news?skip=${skip}&take=${take}`);
    const data = await res.json();
    setNewsList(data);
  }

  useEffect(() => {
    fetchNews();
  }, [skip]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    if (name === "title") {
      const newSlug = generateSlug(value);
      setForm((f) => ({
        ...f,
        title: value,
        slug: newSlug,
      }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const url = "/api/admin/news";

    const formData = new FormData();
    formData.append("id", form.id);
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("content", form.content);
    formData.append("authorId", form.authorId);

    if (uploadedFile) {
      formData.append("file", uploadedFile);
    } else if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setModal({
          title: "Éxito",
          message: isEditing ? "Noticia actualizada" : "Noticia creada",
        });
        setForm({ ...initialFormState, authorId: id });
        setIsEditing(false);
        setUploadedFile(null);
        fetchNews();
      } else {
        setModal({ title: "Error", message: "Error en la operación" });
      }
    } catch (error) {
      console.error(error);
      setModal({ title: "Error", message: "Error en la operación" });
    }
  }

  function handleEdit(item: NewsItem) {
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      content: item.content,
      image: item.image || "",
      authorId: item.authorId,
    });
    setIsEditing(true);
    setUploadedFile(null);
  }

  async function confirmDelete(idToDelete: string) {
    try {
      const res = await fetch(`/api/admin/news?id=${idToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setModal({ title: "Éxito", message: "Noticia borrada" });
        fetchNews();
      } else {
        setModal({ title: "Error", message: "Error borrando noticia" });
      }
    } catch (error) {
      console.error(error);
      setModal({ title: "Error", message: "Error borrando noticia" });
    }
  }

  function handleDelete(idToDelete: string) {
    setModal({
      title: "Confirmar borrado",
      message: "¿Seguro que quieres borrar esta noticia?",
      confirm: async () => {
        await confirmDelete(idToDelete);
        setModal(null);
      },
    });
  }

  function handleImageUpload(result: { urls: string[]; files: unknown[] }) {
    setForm((f) => ({
      ...f,
      image: result.urls[0] || "",
    }));
  }

  const isFormValid =
    form.title.trim() !== "" && form.content.trim() !== "" && form.image !== "";

  console.log(form.image);

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">
        Gestionar Noticias - Usuario: {name}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          autoFocus
        />

        <input
          type="text"
          name="slug"
          placeholder="Slug generado automáticamente"
          value={form.slug}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
        />

        <textarea
          name="content"
          placeholder="Contenido"
          value={form.content}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded h-28"
        />

        <input
          type="text"
          name="image"
          placeholder="URL Imagen generada automáticamente"
          value={form.image}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          disabled
        />

        <Uploader
          albumId={"4"}
          slug={form.slug}
          title={form.title}
          content={form.content}
          onUploadComplete={handleImageUpload}
        />

        <label
          htmlFor="authorId"
          className="block mb-1 font-medium text-gray-700"
        >
          Autor de la noticia
        </label>
        <select
          id="authorId"
          name="authorId"
          value={form.authorId}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          disabled={isEditing}
        >
          <option value={id}>{name}</option>
          <option value="2">CD Estepona Fans</option>
        </select>

        {!isFormValid && (
          <p className="text-sm text-red-600 mt-2">
            {`⚠️ Para poder ${
              isEditing ? "actualizar" : "crear"
            } la noticia, completa:`}{" "}
            {[
              !form.title.trim() && "el título",
              !form.content.trim() && "el contenido",
              !form.image && "una imagen",
            ]
              .filter(Boolean)
              .join(", ")
              .replace(/, ([^,]*)$/, " y $1")}
            .
          </p>
        )}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`px-4 py-2 rounded transition text-white ${
            isFormValid
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isEditing ? "Actualizar Noticia" : "Crear Noticia"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setForm({ ...initialFormState, authorId: id });
              setIsEditing(false);
              setUploadedFile(null);
            }}
            className="ml-4 px-4 py-2 rounded border border-gray-400 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
        )}
      </form>

      <ul className="space-y-4">
        {newsList.map((item) => (
          <li
            key={item.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-gray-600">
                Publicado el:{" "}
                {new Date(item.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between">
        <button
          disabled={skip === 0}
          onClick={() => setSkip(Math.max(0, skip - take))}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          disabled={newsList.length < take}
          onClick={() => setSkip(skip + take)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      {modal && (
        <Modal
          isOpen={!!modal}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
          onConfirm={modal.confirm}
        />
      )}
    </section>
  );
}
