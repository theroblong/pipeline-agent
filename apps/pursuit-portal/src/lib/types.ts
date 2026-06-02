export type FrontmatterValue =
  | string
  | number
  | boolean
  | string[]
  | Record<string, unknown>
  | null;

export type Frontmatter = Record<string, FrontmatterValue>;

export type KnowledgeItem = {
  slug: string;
  filePath: string;
  relativePath: string;
  data: Frontmatter;
  content: string;
};

export type PortalRole = "admin" | "seller";

export type PortalUser = {
  email: string;
  role: PortalRole;
  displayName: string;
  owner?: string;
  allAccess: boolean;
  canViewEnablement: boolean;
};

export type AccessRule = {
  role: PortalRole;
  displayName: string;
  owner?: string;
  allAccess?: boolean;
  canViewEnablement?: boolean;
};
