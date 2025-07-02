"use client";

import { useState, useEffect } from "react";

interface Team {
  id: string;
  name: string;
  location: string;
  crestUrl?: string;
}

interface Match {
  id: string;
  date: string | null;
  location: string;
  isHome: boolean;
  competition: string;
  score?: string;
  team: Team;
}

// Función helper para mostrar fecha con "(N/D)" si la hora UTC es 00:00
function formatDateForDisplay(dateStr: string | null, locale = "es-ES") {
  if (!dateStr) return "Fecha no definida";

  const date = new Date(dateStr);
  const hoursUTC = date.getUTCHours();
  const minutesUTC = date.getUTCMinutes();
  const dateStrLocal = date.toLocaleDateString(locale);

  if (hoursUTC === 0 && minutesUTC === 0) {
    return `${dateStrLocal} (N/D)`;
  }

  return date.toLocaleString(locale);
}

// Ajustamos para que use UTC al rellenar el form
function toLocalDatetimeInputString(utcDateStr: string | null) {
  if (!utcDateStr) return { date: "", time: "" };
  const date = new Date(utcDateStr);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}

export default function MatchesAdmin() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    date: "", // YYYY-MM-DD
    time: "", // HH:mm (optional)
    teamId: "",
    location: "",
    isHome: false,
    competition: "",
    score: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const matchesRes = await fetch("/api/admin/matches");
      const matchesData = await matchesRes.json();
      setMatches(matchesData);

      const teamsRes = await fetch("/api/admin/teams");
      const teamsData = await teamsRes.json();
      setTeams(teamsData);
    }
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, checked, type } = e.target;

    if (name === "teamId") {
      const selectedTeam = teams.find((t) => t.id === value);
      setFormData({
        ...formData,
        teamId: value,
        location: selectedTeam?.location ?? "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      time: "",
      teamId: "",
      location: "",
      isHome: false,
      competition: "",
      score: "",
    });
    setEditingMatch(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    let utcDateISO: string | null = null;
    if (formData.date) {
      const [year, month, day] = formData.date.split("-").map(Number);
      const [hours, minutes] = (formData.time ? formData.time : "00:00")
        .split(":")
        .map(Number);

      const dateUtc = new Date(
        Date.UTC(year, month - 1, day, hours, minutes, 0)
      );

      utcDateISO = dateUtc.toISOString();
    }

    const bodyToSend = {
      ...formData,
      date: utcDateISO,
    };

    const method = editingMatch ? "PUT" : "POST";
    const url = editingMatch
      ? `/api/admin/matches/${editingMatch.id}`
      : "/api/admin/matches";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyToSend),
    });

    if (res.ok) {
      const updatedData = await res.json();
      if (editingMatch) {
        setMatches((prev) =>
          prev.map((m) => (m.id === updatedData.id ? updatedData : m))
        );
      } else {
        setMatches((prev) => [...prev, updatedData]);
      }
      resetForm();
    }
    setLoading(false);
  };

  const handleEdit = (match: Match) => {
    const { date, time } = toLocalDatetimeInputString(match.date);
    setEditingMatch(match);
    setFormData({
      date,
      time,
      teamId: match.team.id,
      location: match.team.location ?? "",
      isHome: match.isHome,
      competition: match.competition,
      score: match.score ?? "",
    });
  };

  const isFormValid = formData.date && formData.teamId && formData.competition;

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold">
        {editingMatch ? "Editar Partido" : "Añadir Partido"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <select
          name="teamId"
          value={formData.teamId}
          onChange={handleChange}
          required
          className="border rounded p-2"
        >
          <option value="">Rival</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isHome"
            checked={formData.isHome}
            onChange={handleChange}
            id="isHome"
            className="h-4 w-4"
          />
          <label htmlFor="isHome">¿Partido en casa?</label>
        </div>
        <input
          type="text"
          name="competition"
          value={formData.competition}
          onChange={handleChange}
          placeholder="Competición"
          required
          className="border rounded p-2"
        />
        <input
          type="text"
          name="score"
          value={formData.score}
          onChange={handleChange}
          placeholder="Resultado (ej. 2:1)"
          className="border rounded p-2"
        />
        <div className="flex space-x-2 md:col-span-3">
          <button
            type="submit"
            disabled={loading || (!editingMatch && !isFormValid)}
            className={`cursor-pointer rounded p-2 flex-1 ${
              loading || (!editingMatch && !isFormValid)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? "Guardando..." : editingMatch ? "Actualizar" : "Crear"}
          </button>
          {editingMatch && (
            <button
              type="button"
              onClick={resetForm}
              className="cursor-pointer bg-gray-300 rounded p-2 hover:bg-gray-400 flex-1"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 className="text-2xl font-bold">Partidos</h3>
      <div className="overflow-x-auto rounded border">
        <table className="min-w-max w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Fecha</th>
              <th className="p-2">Rival</th>
              <th className="p-2">Ubicación</th>
              <th className="p-2">Casa</th>
              <th className="p-2">Competición</th>
              <th className="p-2">Resultado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id} className="border-t">
                <td className="p-2">{formatDateForDisplay(match.date)}</td>
                <td className="p-2">{match.team.name}</td>
                <td className="p-2">
                  {match.isHome
                    ? "Estadio Francisco Muñoz Pérez"
                    : match.team.location}
                </td>
                <td className="p-2">{match.isHome ? "Sí" : "No"}</td>
                <td className="p-2">{match.competition}</td>
                <td className="p-2">{match.score ?? "-"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(match)}
                    className="cursor-pointer bg-yellow-500 text-white rounded p-1 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No hay partidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
