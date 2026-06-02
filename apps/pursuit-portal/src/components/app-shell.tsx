import {
  BookOpen,
  FileText,
  LogOut,
  PanelsTopLeft,
  Target,
  UploadCloud
} from "lucide-react";
import Link from "next/link";
import type React from "react";

import { signOut } from "@/auth";
import type { PortalUser } from "@/lib/types";

type AppShellProps = {
  user: PortalUser;
  children: React.ReactNode;
};

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">P</span>
          <span>
            <strong>Pursuit Portal</strong>
            <small>Pruvida</small>
          </span>
        </Link>
        <nav className="nav-list" aria-label="Main navigation">
          <Link href="/">
            <PanelsTopLeft size={17} aria-hidden="true" />
            Dashboard
          </Link>
          <Link href="/enablement">
            <BookOpen size={17} aria-hidden="true" />
            Enablement
          </Link>
          <Link href="/briefs">
            <FileText size={17} aria-hidden="true" />
            Briefs
          </Link>
          <Link href="/crm-staging">
            <UploadCloud size={17} aria-hidden="true" />
            CRM Staging
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-pill">
            <Target size={16} aria-hidden="true" />
            <span>
              <strong>{user.displayName}</strong>
              <small>{user.role}</small>
            </span>
          </div>
          <form action={signOutAction}>
            <button className="icon-text-button" type="submit">
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="main-panel">{children}</main>
    </div>
  );
}
