"use client";

const nextMatches = [
  {
    id: 1,
    date: "2025-06-10",
    rival: "Atlético Marbella",
    place: "Estadio Municipal",
    time: "18:00",
  },
  {
    id: 2,
    date: "2025-06-17",
    rival: "UD San Pedro",
    place: "Campo La Rada",
    time: "19:00",
  },
];

export default function NextMatchesPreview() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Próximos Partidos</h2>
      <ul className="space-y-3">
        {nextMatches.map(({ id, date, rival, place, time }) => (
          <li
            key={id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{rival}</p>
              <time className="text-sm text-gray-500">
                {date} - {time}
              </time>
              <p className="text-sm text-gray-600">{place}</p>
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Ver calendario completo
      </button>
    </section>
  );
}
