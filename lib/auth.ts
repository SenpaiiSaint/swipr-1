import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { Role } from "../prisma/generated/prisma";
import { ZodError } from "zod";
import { signInSchema } from "./zod";

declare module "next-auth" {
  interface User {
    role: Role;
    orgId: string;
  }

  interface Session {
    user: User & {
      role: Role;
      orgId: string;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Find user
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          // Verify password
          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          // Return user without password
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            orgId: user.orgId,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            // Return null for validation errors
            return null;
          }
          // Re-throw other errors
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.orgId = user.orgId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as Role;
        session.user.orgId = token.orgId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error", // Add custom error page
  },
});
