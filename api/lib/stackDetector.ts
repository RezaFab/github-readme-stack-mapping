import type { GitHubRepo, RepoConfigFiles } from './types.js';

const TOPIC_TECH_MAP: Record<string, string> = {
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
  android: 'Android',
  androidstudio: 'Android',
  jetpack: 'Jetpack Compose',
  compose: 'Jetpack Compose',
  jetpackcompose: 'Jetpack Compose',
  'jetpack-compose': 'Jetpack Compose',
  spring: 'Spring Boot',
  springboot: 'Spring Boot',
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',
  prisma: 'Prisma',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  sqlserver: 'SQL Server',
  mssql: 'SQL Server',
  mongodb: 'MongoDB',
  redis: 'Redis',
  docker: 'Docker',
  git: 'Git',
  firebase: 'Firebase',
  retrofit: 'Retrofit',
  room: 'Room',
  hilt: 'Hilt',
  daggerhilt: 'Hilt',
  tailwindcss: 'Tailwind CSS',
  tailwind: 'Tailwind CSS',
};

const TOPIC_LANGUAGE_MAP: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  java: 'Java',
  kotlin: 'Kotlin',
  python: 'Python',
  php: 'PHP',
  html: 'HTML',
  css: 'CSS',
  dart: 'Dart',
};

const PACKAGE_DEP_TECH_MAP: Record<string, string> = {
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
  expo: 'React Native',
  mysql: 'MySQL',
  pg: 'PostgreSQL',
  postgres: 'PostgreSQL',
  mssql: 'SQL Server',
  mongodb: 'MongoDB',
  redis: 'Redis',
  firebase: 'Firebase',
};

const PACKAGE_DEP_LANGUAGE_MAP: Record<string, string> = {
  typescript: 'TypeScript',
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

function addFromPackageJson(technologies: Set<string>, languages: Set<string>, packageJson?: string): void {
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
    technologies.add('Node.js');
  }

  for (const dep of Object.keys(deps)) {
    const key = dep.toLowerCase();

    const tech = PACKAGE_DEP_TECH_MAP[key];
    if (tech) {
      technologies.add(tech);
    }

    const language = PACKAGE_DEP_LANGUAGE_MAP[key];
    if (language) {
      languages.add(language);
    }
  }
}

function addFromComposerJson(technologies: Set<string>, languages: Set<string>, composerJson?: string): void {
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

    if (key === 'laravel/framework') technologies.add('Laravel');
    if (key === 'codeigniter4/framework') technologies.add('CodeIgniter');
    if (key.startsWith('symfony/')) technologies.add('Symfony');
    if (key === 'php') languages.add('PHP');
  }
}

function addFromPubspec(technologies: Set<string>, languages: Set<string>, pubspecYaml?: string): void {
  if (!pubspecYaml) {
    return;
  }

  if (/^\s*flutter\s*:/im.test(pubspecYaml) || /sdk\s*:\s*flutter/im.test(pubspecYaml)) {
    technologies.add('Flutter');
    languages.add('Dart');
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

function addFromPythonFiles(
  technologies: Set<string>,
  languages: Set<string>,
  requirementsTxt?: string,
  pyprojectToml?: string,
): void {
  const requirementPackages = new Set(parseRequirementsPackages(requirementsTxt));
  const pyproject = (pyprojectToml ?? '').toLowerCase();

  const hasToken = (needle: string): boolean =>
    requirementPackages.has(needle) || pyproject.includes(needle);

  if (hasToken('django')) technologies.add('Django');
  if (hasToken('flask')) technologies.add('Flask');
  if (hasToken('fastapi')) technologies.add('FastAPI');

  if (requirementPackages.size > 0 || pyproject.includes('[project]') || pyproject.includes('[tool.poetry]')) {
    languages.add('Python');
  }
}

function addFromTopics(technologies: Set<string>, languages: Set<string>, topics: string[]): void {
  for (const topic of topics) {
    const normalized = topic.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const compact = normalized.replace(/-/g, '');

    const tech = TOPIC_TECH_MAP[normalized] ?? TOPIC_TECH_MAP[compact];
    if (tech) technologies.add(tech);

    const language = TOPIC_LANGUAGE_MAP[normalized] ?? TOPIC_LANGUAGE_MAP[compact];
    if (language) languages.add(language);
  }
}

function addFromRepoLanguage(languages: Set<string>, language: string | null): void {
  if (!language) {
    return;
  }

  const normalized = language.toLowerCase();

  if (normalized === 'typescript') languages.add('TypeScript');
  if (normalized === 'javascript') languages.add('JavaScript');
  if (normalized === 'java') languages.add('Java');
  if (normalized === 'kotlin') languages.add('Kotlin');
  if (normalized === 'python') languages.add('Python');
  if (normalized === 'php') languages.add('PHP');
  if (normalized === 'html') languages.add('HTML');
  if (normalized === 'css') languages.add('CSS');
  if (normalized === 'dart') languages.add('Dart');
}

function addFromAndroidFiles(technologies: Set<string>, languages: Set<string>, repo: GitHubRepo, files: RepoConfigFiles): void {
  const androidCorpus = [
    files.buildGradle,
    files.buildGradleKts,
    files.appBuildGradle,
    files.appBuildGradleKts,
    files.settingsGradle,
    files.settingsGradleKts,
    files.gradleProperties,
    files.libsVersionsToml,
    files.androidManifest,
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n')
    .toLowerCase();

  if (!androidCorpus) {
    if (repo.language?.toLowerCase() === 'kotlin') {
      technologies.add('Android');
      languages.add('Kotlin');
    }
    return;
  }

  const hasAndroidPlugin =
    androidCorpus.includes('com.android.application') ||
    androidCorpus.includes('com.android.library') ||
    androidCorpus.includes('com.android.test') ||
    androidCorpus.includes('androidapplication') ||
    androidCorpus.includes('androidlibrary');

  const hasAndroidManifest =
    androidCorpus.includes('<manifest') &&
    (androidCorpus.includes('xmlns:android') || androidCorpus.includes('android:name'));

  if (hasAndroidPlugin || hasAndroidManifest || androidCorpus.includes('androidx.')) {
    technologies.add('Android');
  }

  if (
    repo.language?.toLowerCase() === 'kotlin' ||
    androidCorpus.includes('kotlin-android') ||
    androidCorpus.includes('org.jetbrains.kotlin.android')
  ) {
    languages.add('Kotlin');
  }

  if (
    androidCorpus.includes('androidx.compose') ||
    (androidCorpus.includes('buildfeatures') && androidCorpus.includes('compose')) ||
    androidCorpus.includes('compose = true') ||
    androidCorpus.includes('jetpack compose')
  ) {
    technologies.add('Jetpack Compose');
  }

  if (androidCorpus.includes('com.google.firebase') || androidCorpus.includes('firebase-')) {
    technologies.add('Firebase');
  }

  if (androidCorpus.includes('retrofit2') || androidCorpus.includes('com.squareup.retrofit2')) {
    technologies.add('Retrofit');
  }

  if (androidCorpus.includes('androidx.room') || androidCorpus.includes('room-runtime')) {
    technologies.add('Room');
  }

  if (androidCorpus.includes('com.google.dagger:hilt') || androidCorpus.includes('dagger.hilt')) {
    technologies.add('Hilt');
  }
}

function addFromContent(technologies: Set<string>, languages: Set<string>, repo: GitHubRepo, files: RepoConfigFiles): void {
  addFromPackageJson(technologies, languages, files.packageJson);
  addFromComposerJson(technologies, languages, files.composerJson);
  addFromPubspec(technologies, languages, files.pubspecYaml);
  addFromPythonFiles(technologies, languages, files.requirementsTxt, files.pyprojectToml);
  addFromAndroidFiles(technologies, languages, repo, files);

  if (files.dockerfile) {
    technologies.add('Docker');
  }

  const javaBuildCorpus = [
    files.pomXml,
    files.buildGradle,
    files.buildGradleKts,
    files.appBuildGradle,
    files.appBuildGradleKts,
    files.settingsGradle,
    files.settingsGradleKts,
    files.libsVersionsToml,
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n')
    .toLowerCase();

  if (
    javaBuildCorpus.includes('org.springframework.boot') ||
    javaBuildCorpus.includes('spring-boot-starter') ||
    javaBuildCorpus.includes('id("org.springframework.boot")') ||
    javaBuildCorpus.includes("id 'org.springframework.boot'")
  ) {
    technologies.add('Spring Boot');
    languages.add('Java');
  }

  if (javaBuildCorpus.includes('mysql')) technologies.add('MySQL');
  if (javaBuildCorpus.includes('postgresql')) technologies.add('PostgreSQL');
  if (javaBuildCorpus.includes('microsoft.sqlserver') || javaBuildCorpus.includes('mssql')) {
    technologies.add('SQL Server');
  }

  const textCorpus = [
    files.packageJson,
    files.composerJson,
    files.pubspecYaml,
    files.requirementsTxt,
    files.pyprojectToml,
    files.pomXml,
    files.buildGradle,
    files.buildGradleKts,
    files.appBuildGradle,
    files.appBuildGradleKts,
    files.settingsGradle,
    files.settingsGradleKts,
    files.gradleProperties,
    files.libsVersionsToml,
    files.androidManifest,
  ]
    .filter((item): item is string => Boolean(item))
    .join('\n')
    .toLowerCase();

  if (textCorpus.includes('spring-boot')) technologies.add('Spring Boot');
  if (textCorpus.includes('postgresql')) technologies.add('PostgreSQL');
  if (textCorpus.includes('mysql')) technologies.add('MySQL');
  if (textCorpus.includes('sqlserver') || textCorpus.includes('mssql')) technologies.add('SQL Server');
  if (textCorpus.includes('mongodb')) technologies.add('MongoDB');
  if (textCorpus.includes('redis')) technologies.add('Redis');
  if (textCorpus.includes('firebase')) technologies.add('Firebase');
  if (textCorpus.includes('retrofit')) technologies.add('Retrofit');
  if (textCorpus.includes('androidx.room') || textCorpus.includes('room-runtime')) technologies.add('Room');
  if (textCorpus.includes('hilt')) technologies.add('Hilt');
  if (textCorpus.includes('androidx.') || textCorpus.includes('com.android.')) technologies.add('Android');
  if (textCorpus.includes('git')) technologies.add('Git');
}

export function detectStacks(
  repo: GitHubRepo,
  files: RepoConfigFiles,
): { technologies: string[]; languages: string[] } {
  const technologies = new Set<string>();
  const languages = new Set<string>();

  addFromTopics(technologies, languages, repo.topics);
  addFromContent(technologies, languages, repo, files);
  addFromRepoLanguage(languages, repo.language);

  return {
    technologies: [...technologies].sort((a, b) => a.localeCompare(b)),
    languages: [...languages].sort((a, b) => a.localeCompare(b)),
  };
}
