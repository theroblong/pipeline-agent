import type { AccessRule, KnowledgeItem, PortalUser } from "./types";

const ACCESS_RULES: Record<string, AccessRule> = {
  "robert@pruvida.com": {
    role: "admin",
    displayName: "Robert Long",
    allAccess: true,
    canViewEnablement: true
  },
  "brock@pruvida.com": {
    role: "seller",
    displayName: "Brock Warren",
    owner: "Brock Warren",
    canViewEnablement: true
  }
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getAdminEmails() {
  return (process.env.PORTAL_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
}

function getSellerRulesFromEnv(): Record<string, AccessRule> {
  const raw = process.env.PORTAL_SELLER_ACCESS_JSON;

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, AccessRule>;
  } catch {
    return {};
  }
}

export function getAccessRule(email: string): AccessRule | null {
  const normalized = normalizeEmail(email);
  const envSellerRules = getSellerRulesFromEnv();

  if (getAdminEmails().includes(normalized)) {
    return {
      role: "admin",
      displayName: email,
      allAccess: true,
      canViewEnablement: true
    };
  }

  return envSellerRules[normalized] ?? ACCESS_RULES[normalized] ?? null;
}

export function isAllowedEmail(email?: string | null) {
  return Boolean(email && getAccessRule(email));
}

export function makePortalUser(email: string): PortalUser | null {
  const rule = getAccessRule(email);

  if (!rule) {
    return null;
  }

  return {
    email: normalizeEmail(email),
    role: rule.role,
    displayName: rule.displayName,
    owner: rule.owner,
    allAccess: Boolean(rule.allAccess),
    canViewEnablement: Boolean(rule.canViewEnablement ?? rule.allAccess)
  };
}

export function canViewOpportunity(user: PortalUser, opportunity: KnowledgeItem) {
  if (user.allAccess) {
    return true;
  }

  const owner = opportunity.data.owner;
  return typeof owner === "string" && owner === user.owner;
}

export function canViewAccount(user: PortalUser, account: KnowledgeItem) {
  if (user.allAccess) {
    return true;
  }

  const owner = account.data.owner;
  return typeof owner === "string" && owner === user.owner;
}

export function canViewEnablement(user: PortalUser) {
  return user.allAccess || user.canViewEnablement;
}
