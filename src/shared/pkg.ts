export interface PackageJSON {
  dependencies?: Record<string, string>;
  description?: string;
  devDependencies?: Record<string, string>;
  files?: string[];
  homepage?: string;
  keywords?: string[];
  license?: string;
  main?: string;
  name: string;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  private?: boolean;
  scripts?: Record<string, string>;
  version: string;
  [field: string]: unknown;
}
