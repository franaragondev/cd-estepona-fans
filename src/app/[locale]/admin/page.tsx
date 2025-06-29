import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import AdminTabs from "@/components/AdminTabs";

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
      <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenido,{" "}
            <span className="font-semibold text-indigo-600">{user.name}</span>!
          </p>
        </header>

        <AdminTabs userName={user.name} userId={user.id} />
      </main>
    );
  } catch {
    redirect(`/${params.locale}/auth/login`);
  }
}
