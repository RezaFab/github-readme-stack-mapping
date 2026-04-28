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
  tailwindcss: 'Tailwind CSS',
  tailwind: 'Tailwind CSS',
  bootstrap: 'Bootstrap',
  mui: 'Material UI',
  materialui: 'Material UI',
  chakraui: 'Chakra UI',
  redux: 'Redux',
  pinia: 'Pinia',
  graphql: 'GraphQL',
  apollo: 'Apollo GraphQL',
  node: 'Node.js',
  nodejs: 'Node.js',
  express: 'Express',
  nest: 'NestJS',
  nestjs: 'NestJS',
  laravel: 'Laravel',
  codeigniter: 'CodeIgniter',
  symfony: 'Symfony',
  spring: 'Spring Boot',
  springboot: 'Spring Boot',
  dotnet: '.NET',
  aspnet: 'ASP.NET Core',
  rails: 'Ruby on Rails',
  ruby: 'Ruby',
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',
  prisma: 'Prisma',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  mariadb: 'MariaDB',
  sqlite: 'SQLite',
  sqlserver: 'SQL Server',
  mssql: 'SQL Server',
  mongodb: 'MongoDB',
  redis: 'Redis',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  terraform: 'Terraform',
  jenkins: 'Jenkins',
  githubactions: 'GitHub Actions',
  githubactionsworkflow: 'GitHub Actions',
  gitlabci: 'GitLab CI',
  firebase: 'Firebase',
  supabase: 'Supabase',
  flutter: 'Flutter',
  reactnative: 'React Native',
  'react-native': 'React Native',
  android: 'Android',
  androidstudio: 'Android',
  jetpack: 'Jetpack Compose',
  compose: 'Jetpack Compose',
  jetpackcompose: 'Jetpack Compose',
  'jetpack-compose': 'Jetpack Compose',
  kotlin: 'Android',
  ionic: 'Ionic',
  expo: 'Expo',
  electron: 'Electron',
  retrofit: 'Retrofit',
  room: 'Room',
  hilt: 'Hilt',
  daggerhilt: 'Hilt',
  rabbitmq: 'RabbitMQ',
  kafka: 'Kafka',
  go: 'Go',
  gin: 'Gin',
  fiber: 'Fiber',
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
  go: 'Go',
  csharp: 'C#',
  ruby: 'Ruby',
};

const PACKAGE_DEP_TECH_MAP: Record<string, string> = {
  react: 'React',
  vite: 'Vite',
  next: 'Next.js',
  vue: 'Vue',
  nuxt: 'Nuxt',
  '@angular/core': 'Angular',
  svelte: 'Svelte',
  tailwindcss: 'Tailwind CSS',
  bootstrap: 'Bootstrap',
  '@mui/material': 'Material UI',
  '@chakra-ui/react': 'Chakra UI',
  redux: 'Redux',
  '@reduxjs/toolkit': 'Redux',
  pinia: 'Pinia',
  graphql: 'GraphQL',
  '@apollo/client': 'Apollo GraphQL',
  express: 'Express',
  '@nestjs/core': 'NestJS',
  'react-native': 'React Native',
  expo: 'Expo',
  ionic: 'Ionic',
  electron: 'Electron',
  '@prisma/client': 'Prisma',
  prisma: 'Prisma',
  mysql: 'MySQL',
  pg: 'PostgreSQL',
  postgres: 'PostgreSQL',
  mariadb: 'MariaDB',
  sqlite3: 'SQLite',
  mssql: 'SQL Server',
  mongodb: 'MongoDB',
  mongoose: 'MongoDB',
  redis: 'Redis',
  ioredis: 'Redis',
  firebase: 'Firebase',
  '@supabase/supabase-js': 'Supabase',
  kafka: 'Kafka',
  kafkajs: 'Kafka',
  amqplib: 'RabbitMQ',
};

const PACKAGE_DEP_LANGUAGE_MAP: Record<string, string> = {
  typescript: 'TypeScript',
};

const PYTHON_TECH_MAP: Record<string, string> = {
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',
  sqlalchemy: 'SQLAlchemy',
  psycopg2: 'PostgreSQL',
  mysqlclient: 'MySQL',
  pymysql: 'MySQL',
  redis: 'Redis',
  pymongo: 'MongoDB',
  firebaseadmin: 'Firebase',
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
    if (key.includes('predis') || key.includes('redis')) technologies.add('Redis');
    if (key.includes('mongodb')) technologies.add('MongoDB');
    if (key.includes('doctrine/dbal')) technologies.add('SQL');
  }
}

function addFromPubspec(technologies: Set<string>, languages: Set<string>, pubspecYaml?: string): void {
  if (!pubspecYaml) {
    return;
  }

  const content = pubspecYaml.toLowerCase();

  if (/^\s*flutter\s*:/im.test(pubspecYaml) || /sdk\s*:\s*flutter/im.test(pubspecYaml)) {
    technologies.add('Flutter');
    languages.add('Dart');
  }

  if (content.includes('firebase_')) technologies.add('Firebase');
  if (content.includes('supabase_flutter')) technologies.add('Supabase');
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

  for (const [pkg, tech] of Object.entries(PYTHON_TECH_MAP)) {
    if (hasToken(pkg)) technologies.add(tech);
  }

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
  if (normalized === 'go') languages.add('Go');
  if (normalized === 'c#') languages.add('C#');
  if (normalized === 'ruby') languages.add('Ruby');
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

function addFromGenericCorpus(technologies: Set<string>, corpus: string): void {
  const rules: Array<[string, string]> = [
    ['spring-boot', 'Spring Boot'],
    ['postgresql', 'PostgreSQL'],
    ['mysql', 'MySQL'],
    ['mariadb', 'MariaDB'],
    ['sqlite', 'SQLite'],
    ['sqlserver', 'SQL Server'],
    ['mssql', 'SQL Server'],
    ['mongodb', 'MongoDB'],
    ['redis', 'Redis'],
    ['firebase', 'Firebase'],
    ['supabase', 'Supabase'],
    ['retrofit', 'Retrofit'],
    ['androidx.room', 'Room'],
    ['room-runtime', 'Room'],
    ['hilt', 'Hilt'],
    ['androidx.', 'Android'],
    ['com.android.', 'Android'],
    ['kubernetes', 'Kubernetes'],
    ['terraform', 'Terraform'],
    ['jenkins', 'Jenkins'],
    ['github/workflows', 'GitHub Actions'],
    ['.github/workflows', 'GitHub Actions'],
    ['rabbitmq', 'RabbitMQ'],
    ['kafka', 'Kafka'],
    ['gin-gonic/gin', 'Gin'],
    ['gofiber/fiber', 'Fiber'],
    ['dotnet', '.NET'],
    ['aspnetcore', 'ASP.NET Core'],
    ['rails', 'Ruby on Rails'],
  ];

  for (const [needle, tech] of rules) {
    if (corpus.includes(needle)) {
      technologies.add(tech);
    }
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

  addFromGenericCorpus(technologies, textCorpus);
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
