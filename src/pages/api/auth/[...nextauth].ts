import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

// Extend User type to include accessToken
declare module "next-auth" {
  interface User {
    accessToken?: string;
  }
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: Record<string, unknown>;
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
// Debug logging - check what URLs are being used
console.log('🔍 NextAuth Configuration Debug:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXT_PUBLIC_AUTH_URL:', process.env.NEXT_PUBLIC_AUTH_URL);
console.log('CLIENTID:', process.env.CLIENTID?.substring(0, 20) + '...');
console.log('CLIENTSECRET exists:', !!process.env.CLIENTSECRET);
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);

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
          console.log(`${process.env.NEXT_PUBLIC_API_URL}/user/google`);
          // Send Google user details to NestJS API to create/get a user and receive JWT
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user/google`,
            {
              email: user.email,
              googleId: user.id,
              fullName: user.name || "",
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
      // On initial sign-in, prefer backend token returned during Google login
      if (user && account?.provider === "google") {
        const backendAccessToken =
          (account as any).backendAccessToken ??
          (user as any).accessToken;
        const backendUser =
          (account as any).backendUser ?? (user as any).backendUser ?? user;

        if (backendAccessToken) {
          token.accessToken = backendAccessToken;
        }
        token.user = buildSlimUser(backendUser) as Record<string, unknown>;
        return token;
      }

      // Credentials or existing session refresh
      if (user) {
        const u = user as unknown as {
          accessToken?: string;
        } & Record<string, unknown>;
        if (u.accessToken) {
          token.accessToken = u.accessToken;
        }
        token.user = buildSlimUser(u);
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      // Ensure the user payload stays slim in the session as well.
      session.user = (token.user as any) ?? session.user;
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
