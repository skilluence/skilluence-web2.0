import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "admin_token";
const SESSION_HOURS = 8;

function secret() {
  return new TextEncoder().encode(
    process.env.SESSION_SECRET ?? "dev-only-secret-change-in-production"
  );
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
