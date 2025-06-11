import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Uploader from "@/components/Uploader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface JwtPayload {
  id: string;
  email: string;
  role: string;
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
      <main className="min-h-screen p-8">
        <h1>Admin Dashboard</h1>
        <p>Bienvenido, {user.email}!</p>
        <Uploader />
      </main>
    );
  } catch {
    redirect(`/${params.locale}/auth/login`);
  }
}
