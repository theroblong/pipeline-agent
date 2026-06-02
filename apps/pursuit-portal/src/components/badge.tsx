import { badgeTone } from "@/lib/format";
import type React from "react";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "good" | "watch" | "quiet" | "neutral";
};

export function Badge({ children, tone }: BadgeProps) {
  const className = `badge badge-${tone ?? badgeTone(String(children))}`;
  return <span className={className}>{children}</span>;
}
