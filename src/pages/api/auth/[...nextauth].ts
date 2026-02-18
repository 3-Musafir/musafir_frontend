import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

// Extend User type to include accessToken and refreshToken
declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
  interface Session {
    accessToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: Record<string, unknown>;
    error?: string;
  }
}

// Helper function to refresh access token
async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/refresh-access-token`,
      { refreshToken: token.refreshToken },
      { timeout: 10000 }
    );

    const refreshedTokens = response.data;

    if (!refreshedTokens.accessToken) {
      throw new Error("No access token returned");
    }

    // Return updated token with new access token and extended expiry
    // JWT_EXPIRATION is 10h, so set expiry to 9.5h from now to refresh before actual expiry
    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      // Backend now rotates refresh tokens — use the new one if provided
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 9.5 * 60 * 60 * 1000, // 9.5 hours
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Keep session lightweight: only essential claims for authZ and display
// (id, email, name, roles, profileComplete) plus accessToken.
// All detailed profile data should come from /user/me.
const buildSlimUser = (raw: Record<string, unknown> | undefined) => {
  if (!raw) return {};
  const id =
    (raw as any)._id ??
    (raw as any).id ??
    (raw as any).userId ??
    null;
  const email = (raw as any).email ?? null;
  const name =
    (raw as any).fullName ??
    (raw as any).name ??
    (raw as any).given_name ??
    null;
  const roles = Array.isArray((raw as any).roles)
    ? ((raw as any).roles as string[])
    : [];
  const profileComplete = Boolean((raw as any).profileComplete);

  return {
    id,
    email,
    name,
    roles,
    profileComplete,
  };
};


export default NextAuth({
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.CLIENTID!,
      clientSecret: process.env.CLIENTSECRET!,
    }),

    // Credentials (Email/Password) Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );
          if (res.data && res.data.accessToken) {
            return {
              ...res.data.user,
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
            };
          }
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Invalid email or password");
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Send Google ID token to backend for server-side verification
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user/google`,
            {
              idToken: account.id_token,
            },
            { timeout: 10000 }
          );
          // Backend may return bare object or wrapped in { data }
          const payload = res?.data?.data ?? res?.data;

          // Capture backend-issued tokens and user
          if (payload?.accessToken) {
            (user as any).accessToken = payload.accessToken;
            (user as any).refreshToken = payload.refreshToken;
            (user as any).backendUser = payload.user ?? {};
            (account as any).backendAccessToken = payload.accessToken;
            (account as any).backendUser = payload.user ?? {};
            user.email = payload.email ?? user.email;
            return true;
          }

          // If backend did not return an access token, block sign-in so the UI shows an error
          return false;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // On initial sign-in with Google
      if (user && account?.provider === "google") {
        const backendAccessToken =
          (account as any).backendAccessToken ??
          (user as any).accessToken;
        const backendRefreshToken = (user as any).refreshToken;
        const backendUser =
          (account as any).backendUser ?? (user as any).backendUser ?? user;

        return {
          ...token,
          accessToken: backendAccessToken,
          refreshToken: backendRefreshToken,
          // Set expiry to 9.5 hours from now (JWT_EXPIRATION is 10h)
          accessTokenExpires: Date.now() + 9.5 * 60 * 60 * 1000,
          user: buildSlimUser(backendUser) as Record<string, unknown>,
        };
      }

      // On initial sign-in with credentials
      if (user) {
        const u = user as unknown as {
          accessToken?: string;
          refreshToken?: string;
        } & Record<string, unknown>;

        return {
          ...token,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          // Set expiry to 9.5 hours from now (JWT_EXPIRATION is 10h)
          accessTokenExpires: Date.now() + 9.5 * 60 * 60 * 1000,
          user: buildSlimUser(u),
        };
      }

      // On subsequent requests, check if token needs refresh.
      // Refresh when: (a) token expires in less than 30 minutes, OR
      // (b) a previous refresh failed — retry so the user isn't stuck.
      const expiresIn = (token.accessTokenExpires as number) - Date.now();
      const shouldRefresh =
        token.accessTokenExpires && expiresIn < 30 * 60 * 1000;
      const hadRefreshError = token.error === "RefreshAccessTokenError";

      if ((shouldRefresh || hadRefreshError) && token.refreshToken) {
        return refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      // Ensure the user payload stays slim in the session as well.
      session.user = (token.user as any) ?? session.user;
      // Pass refresh error to client so it can handle re-authentication.
      // Clear the flag when the token is healthy so a recovered session
      // doesn't carry a stale error.
      session.error = token.error ? (token.error as string) : undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});
