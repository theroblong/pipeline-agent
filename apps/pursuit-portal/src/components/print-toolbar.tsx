"use client";

import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

type PrintToolbarProps = {
  title: string;
};

export function PrintToolbar({ title }: PrintToolbarProps) {
  return (
    <div className="brief-toolbar">
      <Link className="brief-toolbar-link" href="/briefs">
        <ArrowLeft size={16} aria-hidden="true" />
        Brief builder
      </Link>
      <div>
        <strong>{title}</strong>
        <span>Prospect-facing preview. Save as PDF when ready.</span>
      </div>
      <button className="primary-button" type="button" onClick={() => window.print()}>
        <Printer size={16} aria-hidden="true" />
        Print / Save PDF
      </button>
    </div>
  );
}
