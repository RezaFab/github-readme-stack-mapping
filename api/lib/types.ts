export type QueryValue = string | string[] | undefined;

export interface ApiRequest {
  query: Record<string, QueryValue>;
}

export interface ApiResponse {
  status: (statusCode: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
  json: (body: unknown) => void;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  owner: {
    login: string;
  };
}

export interface RepoConfigFiles {
  packageJson?: string;
  composerJson?: string;
  pubspecYaml?: string;
  requirementsTxt?: string;
  pyprojectToml?: string;
  dockerfile?: string;
}

export interface RepoStackAnalysis {
  repo: GitHubRepo;
  stacks: string[];
}

export interface StackGroup {
  stack: string;
  repos: RepoStackAnalysis[];
}

export interface CardTheme {
  bgColor: string;
  borderColor: string;
  titleColor: string;
  textColor: string;
  mutedTextColor: string;
  sectionBgColor: string;
}

export interface CardOptions {
  theme: 'light' | 'dark';
  hideBorder: boolean;
  titleColor?: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  maxReposPerStack: number;
  maxStacks: number;
}
