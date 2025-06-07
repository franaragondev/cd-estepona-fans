"use client";

const dummyNews = [
  {
    id: 1,
    title: "Victoria contundente en el último partido",
    date: "2025-06-01",
    summary:
      "El CD Estepona gana 3-0 contra el rival local con una gran actuación de los delanteros.",
  },
  {
    id: 2,
    title: "Anuncio de nueva equipación para la temporada 2025",
    date: "2025-05-25",
    summary:
      "Ya está disponible la nueva camiseta oficial con diseño renovado para los fans.",
  },
  {
    id: 3,
    title: "Partido solidario el próximo domingo",
    date: "2025-05-20",
    summary:
      "Se celebrará un partido benéfico para apoyar a las familias afectadas por las recientes inundaciones.",
  },
];

export default function LatestNews() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Últimas Noticias</h2>
      <ul className="space-y-4">
        {dummyNews.map(({ id, title, date, summary }) => (
          <li key={id} className="border-b pb-3">
            <h3 className="font-bold">{title}</h3>
            <time className="text-sm text-gray-500">{date}</time>
            <p className="text-gray-700">{summary}</p>
          </li>
        ))}
      </ul>
      <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Ver todas las noticias
      </button>
    </section>
  );
}
