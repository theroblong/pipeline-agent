import { LogIn } from "lucide-react";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

async function googleSignIn() {
  "use server";
  await signIn("google", { redirectTo: "/" });
}

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <p className="eyebrow">Pruvida internal</p>
        <h1>Pursuit Portal</h1>
        <p className="lede">
          Sign in with an approved Pruvida Google account to view assigned
          opportunities and sales enablement material.
        </p>
        <form action={googleSignIn} className="section">
          <button className="primary-button" type="submit">
            <LogIn size={17} aria-hidden="true" />
            Sign in with Google
          </button>
        </form>
        <p className="muted section">
          Access is limited to approved accounts. Robert has admin access; Brock
          sees opportunities owned by Brock Warren plus enablement assets.
        </p>
      </section>
    </main>
  );
}
