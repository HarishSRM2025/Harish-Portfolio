import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "./auth";

/**
 * Call at the top of any protected API route handler.
 * Returns the decoded token payload if the request is authenticated,
 * or null if not — the caller should then return a 401 response.
 */
export function getAdminFromRequest() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
