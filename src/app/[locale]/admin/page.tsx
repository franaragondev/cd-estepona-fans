import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export default async function AdminPage({
  params,
}: {
  params: { locale: string };
}) {
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
      <main className="min-h-screen p-8">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.email}!</p>
      </main>
    );
  } catch (e) {
    redirect(`/${params.locale}/auth/login`);
  }
}
