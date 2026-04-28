import type { GitHubRepo, RepoConfigFiles } from './types';

const TOPIC_STACK_MAP: Record<string, string> = {
  react: 'React',
  vite: 'Vite',
  nextjs: 'Next.js',
  next: 'Next.js',
  vue: 'Vue',
  nuxt: 'Nuxt',
  angular: 'Angular',
  svelte: 'Svelte',
  node: 'Node.js',
  nodejs: 'Node.js',
  express: 'Express',
  nest: 'NestJS',
  nestjs: 'NestJS',
  laravel: 'Laravel',
  codeigniter: 'CodeIgniter',
  symfony: 'Symfony',
  flutter: 'Flutter',
  reactnative: 'React Native',
  'react-native': 'React Native',
  spring: 'Spring Boot',
  springboot: 'Spring Boot',
  java: 'Java',
  python: 'Python',
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',
  prisma: 'Prisma',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  docker: 'Docker',
  tailwindcss: 'Tailwind CSS',
  tailwind: 'Tailwind CSS',
};

const PACKAGE_DEP_STACK_MAP: Record<string, string> = {
  react: 'React',
  vite: 'Vite',
  next: 'Next.js',
  vue: 'Vue',
  nuxt: 'Nuxt',
  '@angular/core': 'Angular',
  svelte: 'Svelte',
  express: 'Express',
  '@nestjs/core': 'NestJS',
  '@prisma/client': 'Prisma',
  prisma: 'Prisma',
  tailwindcss: 'Tailwind CSS',
  'react-native': 'React Native',
  mysql: 'MySQL',
  pg: 'PostgreSQL',
  postgres: 'PostgreSQL',
};

function safeJsonParse<T>(raw?: string): T | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function addStacksFromPackageJson(stacks: Set<string>, packageJson?: string): void {
  const parsed = safeJsonParse<{
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  }>(packageJson);

  if (!parsed) {
    return;
  }

  const deps = {
    ...(parsed.dependencies ?? {}),
    ...(parsed.devDependencies ?? {}),
    ...(parsed.peerDependencies ?? {}),
  };

  if (Object.keys(deps).length > 0) {
    stacks.add('Node.js');
  }

  for (const dep of Object.keys(deps)) {
    const stack = PACKAGE_DEP_STACK_MAP[dep.toLowerCase()];
    if (stack) {
      stacks.add(stack);
    }
  }
}

function addStacksFromComposerJson(stacks: Set<string>, composerJson?: string): void {
  const parsed = safeJsonParse<{
    require?: Record<string, string>;
    'require-dev'?: Record<string, string>;
  }>(composerJson);

  if (!parsed) {
    return;
  }

  const deps = {
    ...(parsed.require ?? {}),
    ...(parsed['require-dev'] ?? {}),
  };

  for (const dep of Object.keys(deps)) {
    const key = dep.toLowerCase();

    if (key === 'laravel/framework') {
      stacks.add('Laravel');
    }

    if (key === 'codeigniter4/framework') {
      stacks.add('CodeIgniter');
    }

    if (key.startsWith('symfony/')) {
      stacks.add('Symfony');
    }

    if (key === 'php') {
      stacks.add('PHP');
    }
  }
}

function addStacksFromPubspec(stacks: Set<string>, pubspecYaml?: string): void {
  if (!pubspecYaml) {
    return;
  }

  if (/^\s*flutter\s*:/im.test(pubspecYaml) || /sdk\s*:\s*flutter/im.test(pubspecYaml)) {
    stacks.add('Flutter');
  }
}

function parseRequirementsPackages(requirementsTxt?: string): string[] {
  if (!requirementsTxt) {
    return [];
  }

  return requirementsTxt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/[<>=!~\[]/, 1)[0].trim().toLowerCase())
    .filter(Boolean);
}

function addStacksFromPythonFiles(
  stacks: Set<string>,
  requirementsTxt?: string,
  pyprojectToml?: string,
): void {
  const requirementPackages = new Set(parseRequirementsPackages(requirementsTxt));
  const pyproject = (pyprojectToml ?? '').toLowerCase();

  const hasToken = (needle: string): boolean =>
    requirementPackages.has(needle) || pyproject.includes(needle);

  if (hasToken('django')) {
    stacks.add('Django');
  }

  if (hasToken('flask')) {
    stacks.add('Flask');
  }

  if (hasToken('fastapi')) {
    stacks.add('FastAPI');
  }

  if (requirementPackages.size > 0 || pyproject.includes('[project]') || pyproject.includes('[tool.poetry]')) {
    stacks.add('Python');
  }
}

function addStacksFromTopics(stacks: Set<string>, topics: string[]): void {
  for (const topic of topics) {
    const normalized = topic.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const compact = normalized.replace(/-/g, '');

    if (TOPIC_STACK_MAP[normalized]) {
      stacks.add(TOPIC_STACK_MAP[normalized]);
    }

    if (TOPIC_STACK_MAP[compact]) {
      stacks.add(TOPIC_STACK_MAP[compact]);
    }
  }
}

function addStacksFromLanguage(stacks: Set<string>, language: string | null): void {
  if (!language) {
    return;
  }

  const normalized = language.toLowerCase();

  if (normalized === 'java') {
    stacks.add('Java');
  }

  if (normalized === 'python') {
    stacks.add('Python');
  }

  if (normalized === 'php') {
    stacks.add('PHP');
  }
}

function addStacksFromContent(stacks: Set<string>, files: RepoConfigFiles): void {
  addStacksFromPackageJson(stacks, files.packageJson);
  addStacksFromComposerJson(stacks, files.composerJson);
  addStacksFromPubspec(stacks, files.pubspecYaml);
  addStacksFromPythonFiles(stacks, files.requirementsTxt, files.pyprojectToml);

  if (files.dockerfile) {
    stacks.add('Docker');
  }

  const textCorpus = [
    files.packageJson,
    files.composerJson,
    files.pubspecYaml,
    files.requirementsTxt,
    files.pyprojectToml,
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n')
    .toLowerCase();

  if (textCorpus.includes('spring-boot')) {
    stacks.add('Spring Boot');
  }

  if (textCorpus.includes('postgresql')) {
    stacks.add('PostgreSQL');
  }

  if (textCorpus.includes('mysql')) {
    stacks.add('MySQL');
  }
}

export function detectStacks(repo: GitHubRepo, files: RepoConfigFiles): string[] {
  const stacks = new Set<string>();

  addStacksFromTopics(stacks, repo.topics);
  addStacksFromContent(stacks, files);
  addStacksFromLanguage(stacks, repo.language);

  return [...stacks].sort((a, b) => a.localeCompare(b));
}
