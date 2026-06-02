import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { makePortalUser } from "@/lib/access";
import type { PortalUser } from "@/lib/types";

export async function getCurrentUser(): Promise<PortalUser | null> {
  if (process.env.NODE_ENV !== "production" && process.env.DEV_AUTH_EMAIL) {
    return makePortalUser(process.env.DEV_AUTH_EMAIL);
  }

  const session = await auth();
  const sessionEmail = session?.user?.email;

  if (sessionEmail) {
    return makePortalUser(sessionEmail);
  }

  return null;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
