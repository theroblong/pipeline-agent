import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { isAllowedEmail } from "@/lib/access";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async signIn({ user }) {
      return isAllowedEmail(user.email);
    }
  },
  trustHost: true
});
