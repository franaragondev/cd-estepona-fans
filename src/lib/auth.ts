import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "una_clave_secreta_muy_segura";
const encoder = new TextEncoder();

export async function verifyToken(token: string | undefined) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
    return payload;
  } catch {
    return null;
  }
}

export async function getUserFromToken(authorizationHeader?: string) {
  if (!authorizationHeader) return null;

  const token = authorizationHeader.replace("Bearer ", "");
  const decoded = await verifyToken(token);
  return decoded;
}
