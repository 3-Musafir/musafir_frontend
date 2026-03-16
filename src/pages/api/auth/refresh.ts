import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { encode } from "next-auth/jwt";
import axios from "axios";

/**
 * POST /api/auth/refresh
 *
 * Force-refreshes the backend access token using the refresh token stored
 * inside the NextAuth JWT cookie. This is called by the axios response
 * interceptor when the backend rejects a request with 401/403 due to an
 * expired JWT — even if the NextAuth jwt() callback's own timer
 * (accessTokenExpires) hasn't elapsed yet.
 *
 * On success the response includes the new accessToken so the interceptor
 * can immediately retry the failed request. The NextAuth session cookie is
 * also updated so subsequent getSession() calls return the fresh token.
 */

// Deduplication: concurrent requests share a single in-flight refresh
// to avoid burning the single-use refresh token with a second call.
let inflightRefresh: Promise<{ accessToken: string; refreshToken?: string }> | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Read the current JWT from the NextAuth session cookie
    const token = await getToken({ req, secret });
    if (!token?.refreshToken) {
      return res.status(401).json({ error: "No refresh token" });
    }

    // Call the backend refresh endpoint (deduplicated)
    if (!inflightRefresh) {
      inflightRefresh = axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/refresh-access-token`,
          { refreshToken: token.refreshToken },
          { timeout: 10000 }
        )
        .then((r) => r.data)
        .finally(() => {
          inflightRefresh = null;
        });
    }

    const refreshedData = await inflightRefresh;
    const newAccessToken = refreshedData?.accessToken;
    if (!newAccessToken) {
      return res.status(401).json({ error: "Refresh failed" });
    }

    // Update the JWT with the new access token and reset expiry
    const updatedToken = {
      ...token,
      accessToken: newAccessToken,
      refreshToken: refreshedData.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 9.5 * 60 * 60 * 1000,
      error: undefined,
    };

    // Encode the updated JWT and set it as the session cookie
    const encodedToken = await encode({ token: updatedToken, secret });

    const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://");
    const cookieName = secureCookie
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    const maxAge = 30 * 24 * 60 * 60; // 30 days — matches backend refresh token TTL
    res.setHeader(
      "Set-Cookie",
      `${cookieName}=${encodedToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureCookie ? "; Secure" : ""}`
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    console.error("Force refresh failed:", error?.response?.data || error.message);
    return res.status(401).json({ error: "Refresh failed" });
  }
}
