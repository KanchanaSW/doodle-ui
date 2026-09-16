export interface RegistryFile {
  name: string;
  path: string;
  type: "component" | "shared";
  content: string;
}

export interface RegistryComponent {
  name: string;
  displayName: string;
  description: string;
  files: RegistryFile[];
  dependencies: string[];
  devDependencies?: string[];
  internalDependencies: string[];
  componentDependencies: string[];
}

export interface RegistrySharedItem {
  name: string;
  path: string;
  dependencies: string[];
  content: string;
}

export interface Registry {
  name: string;
  version: string;
  homepage: string;
  repository: string;
  sharedDependencies: string[];
  sharedFiles: RegistrySharedItem[];
  components: Record<string, RegistryComponent>;
}
