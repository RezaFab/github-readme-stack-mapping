import type { GitHubRepo, RepoConfigFiles } from './types';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_API_VERSION = '2022-11-28';
const REPO_CONTENT_PATHS = {
  packageJson: 'package.json',
  composerJson: 'composer.json',
  pubspecYaml: 'pubspec.yaml',
  requirementsTxt: 'requirements.txt',
  pyprojectToml: 'pyproject.toml',
  dockerfile: 'Dockerfile',
} as const;

interface GitHubApiError extends Error {
  status: number;
}

function createGitHubApiError(status: number, message: string): GitHubApiError {
  const error = new Error(message) as GitHubApiError;
  error.status = status;
  return error;
}

function getGitHubHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json, application/vnd.github.mercy-preview+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    'User-Agent': 'github-stack-mapping',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

interface RawRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  owner: {
    login: string;
  };
}

function normalizeRepo(raw: RawRepo): GitHubRepo {
  return {
    name: raw.name,
    description: raw.description,
    html_url: raw.html_url,
    homepage: raw.homepage,
    stargazers_count: raw.stargazers_count,
    forks_count: raw.forks_count,
    language: raw.language,
    topics: raw.topics ?? [],
    updated_at: raw.updated_at,
    owner: {
      login: raw.owner.login,
    },
  };
}

export async function fetchPublicRepositories(username: string, token?: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  const perPage = 100;

  for (let page = 1; page <= 10; page += 1) {
    const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?type=public&sort=updated&per_page=${perPage}&page=${page}`;
    const response = await fetch(url, {
      headers: getGitHubHeaders(token),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw createGitHubApiError(404, `GitHub user "${username}" was not found.`);
      }

      if (response.status === 403) {
        const remaining = response.headers.get('x-ratelimit-remaining');
        if (remaining === '0') {
          throw createGitHubApiError(429, 'GitHub API rate limit exceeded. Try again later or set GITHUB_TOKEN.');
        }
      }

      throw createGitHubApiError(response.status, `GitHub API returned ${response.status}.`);
    }

    const rawRepos = (await response.json()) as RawRepo[];
    repos.push(...rawRepos.map(normalizeRepo));

    if (rawRepos.length < perPage) {
      break;
    }
  }

  return repos;
}

interface RepoFileContentResponse {
  content?: string;
  encoding?: string;
  type?: string;
}

function decodeBase64Utf8(value: string): string {
  const normalized = value.replace(/\n/g, '');
  return Buffer.from(normalized, 'base64').toString('utf8');
}

async function fetchRepoFile(
  owner: string,
  repoName: string,
  path: string,
  token?: string,
): Promise<string | undefined> {
  const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/contents/${encodeURIComponent(path)}`;
  const response = await fetch(url, {
    headers: getGitHubHeaders(token),
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    return undefined;
  }

  const payload = (await response.json()) as RepoFileContentResponse;

  if (payload.type !== 'file') {
    return undefined;
  }

  if (payload.encoding === 'base64' && payload.content) {
    return decodeBase64Utf8(payload.content);
  }

  return undefined;
}

export async function fetchRepoConfigFiles(repo: GitHubRepo, token?: string): Promise<RepoConfigFiles> {
  const owner = repo.owner.login;
  const repoName = repo.name;

  const [packageJson, composerJson, pubspecYaml, requirementsTxt, pyprojectToml, dockerfile] = await Promise.all([
    fetchRepoFile(owner, repoName, REPO_CONTENT_PATHS.packageJson, token),
    fetchRepoFile(owner, repoName, REPO_CONTENT_PATHS.composerJson, token),
    fetchRepoFile(owner, repoName, REPO_CONTENT_PATHS.pubspecYaml, token),
    fetchRepoFile(owner, repoName, REPO_CONTENT_PATHS.requirementsTxt, token),
    fetchRepoFile(owner, repoName, REPO_CONTENT_PATHS.pyprojectToml, token),
    fetchRepoFile(owner, repoName, REPO_CONTENT_PATHS.dockerfile, token),
  ]);

  return {
    packageJson,
    composerJson,
    pubspecYaml,
    requirementsTxt,
    pyprojectToml,
    dockerfile,
  };
}

export function getGitHubErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'Unexpected error while talking to GitHub API.';
}

export function getGitHubErrorStatus(error: unknown): number {
  if (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number') {
    return error.status;
  }

  return 502;
}
