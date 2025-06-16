import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import GalleryAdmin from "@/components/GalleryAdmin";
import NewsAdmin from "@/components/NewsAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function AdminPage({ params }: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) {
    redirect(`/${params.locale}/auth/login`);
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (user.role.toLowerCase() !== "admin") {
      redirect(`/${params.locale}/auth/login`);
    }

    return (
      <main className="min-h-screen bg-gray-50 p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenido,{" "}
            <span className="font-semibold text-indigo-600">{user.name}</span>!
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
              Noticias
            </h2>
            <NewsAdmin name={user.name} id={user.id} />
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
              Galería
            </h2>
            <GalleryAdmin />
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
              Partidos
            </h2>
            {/* <MatchesAdmin /> */}
            <h4 className="flex justify-center">PRÓXIMAMENTE...</h4>
          </div>
        </section>
      </main>
    );
  } catch {
    redirect(`/${params.locale}/auth/login`);
  }
}
