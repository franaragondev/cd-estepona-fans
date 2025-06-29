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
  published: boolean;
  showTitle: boolean;
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
  published: false,
  showTitle: true,
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
  const [draftsList, setDraftsList] = useState<NewsItem[]>([]);
  const [form, setForm] = useState({ ...initialFormState, authorId: id });
  const [isEditing, setIsEditing] = useState(false);
  const [skip, setSkip] = useState(0);
  const take = 3;
  const [hasMore, setHasMore] = useState(false);

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
    const resPublic = await fetch(
      `/api/admin/news?skip=${skip}&take=${take + 1}&published=true`
    );
    const dataPublic = await resPublic.json();

    setNewsList(dataPublic.slice(0, take));
    setHasMore(dataPublic.length > take);

    const resDrafts = await fetch(
      `/api/admin/news?skip=0&take=100&published=false`
    );
    const dataDrafts = await resDrafts.json();
    setDraftsList(dataDrafts);
  }

  useEffect(() => {
    fetchNews();
  }, [skip]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const { name, checked } = target;

      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      const { name, value } = target;

      if (name === "title") {
        setForm((f) => ({ ...f, title: value, slug: generateSlug(value) }));
      } else {
        setForm((f) => ({ ...f, [name]: value }));
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const requireImage = form.published;
    const isFormValid =
      form.title.trim() !== "" &&
      form.content.trim() !== "" &&
      (!requireImage || form.image !== "");
    if (!isFormValid) {
      setModal({
        title: "Error",
        message: form.published
          ? "Para publicar la noticia, completa título, contenido e imagen."
          : "Para guardar borrador, completa título y contenido.",
      });
      return;
    }

    const method = isEditing ? "PUT" : "POST";
    const url = "/api/admin/news";

    const formData = new FormData();
    formData.append("id", form.id);
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("content", form.content);
    formData.append("authorId", form.authorId);
    formData.append("published", form.published ? "true" : "false");
    formData.append("showTitle", form.showTitle ? "true" : "false");

    if (uploadedFile) {
      formData.append("file", uploadedFile);
    } else if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        setModal({
          title: "Éxito",
          message: isEditing
            ? form.published
              ? "Noticia actualizada y publicada"
              : "Borrador actualizado"
            : form.published
            ? "Noticia creada y publicada"
            : "Borrador guardado",
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
      published: item.published,
      showTitle: item.showTitle ?? true,
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

  async function handlePublishDraft(idToPublish: string) {
    try {
      const formData = new FormData();
      formData.append("id", idToPublish);
      formData.append("published", "true");

      const res = await fetch("/api/admin/news", {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        setModal({ title: "Éxito", message: "Borrador publicado" });
        fetchNews();
      } else {
        setModal({ title: "Error", message: "Error publicando borrador" });
      }
    } catch (error) {
      console.error(error);
      setModal({ title: "Error", message: "Error publicando borrador" });
    }
  }

  function handleImageUpload(result: { urls: string[] }) {
    setForm((f) => ({ ...f, image: result.urls[0] || "" }));
  }

  const isFormValid =
    form.title.trim() !== "" && form.content.trim() !== "" && form.image !== "";

  return (
    <section>
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

        <label className="inline-flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            name="showTitle"
            checked={form.showTitle}
            onChange={handleChange}
            className="form-checkbox h-3 w-3 text-indigo-600"
          />
          <span>Mostrar título en la noticia</span>
        </label>

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
        <p className="text-xs text-gray-500 -mt-4 mb-6">
          Puedes usar <strong>**negrita**</strong>, <em>*cursiva*</em>,{" "}
          ~~tachado~~ y enlaces <span>https://ejemplo.com</span>.
        </p>

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
          albumId="4"
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
          <p className="text-sm text-red-600 mt-2 -mb-2">
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

        <div className="flex justify-between">
          <label className="inline-flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span>Publicar ahora</span>
          </label>

          <button
            type="submit"
            disabled={
              form.title.trim() === "" ||
              form.content.trim() === "" ||
              (form.published && form.image === "")
            }
            className={`cursor-pointer mt-4 px-4 py-2 rounded transition text-white ${
              form.title.trim() !== "" &&
              form.content.trim() !== "" &&
              (!form.published || form.image !== "")
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isEditing
              ? form.published
                ? "Actualizar y Publicar"
                : "Actualizar Borrador"
              : form.published
              ? "Crear y Publicar"
              : "Guardar Borrador"}
          </button>
        </div>
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

      <h2 className="text-xl font-semibold mb-4">Noticias Publicadas</h2>
      <ul className="space-y-4 mb-12">
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
                className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 transition cursor-pointer"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mb-6 flex justify-between">
        <button
          disabled={skip === 0}
          onClick={() => setSkip(Math.max(0, skip - take))}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          disabled={!hasMore}
          onClick={() => setSkip(skip + take)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Borradores</h2>
      {draftsList.length === 0 && <p>No hay borradores guardados.</p>}
      <ul className="space-y-4">
        {draftsList.map((item) => (
          <li
            key={item.id}
            className="bg-yellow-50 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-gray-600">
                Última actualización:{" "}
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
                onClick={() => handlePublishDraft(item.id)}
                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
              >
                Publicar
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
