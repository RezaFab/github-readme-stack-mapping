import type { StackGroup } from './types.js';

export type StackSection = 'frontend' | 'backend' | 'tools' | 'mobile' | 'other' | 'all';

const STACK_TO_SECTION: Record<string, Exclude<StackSection, 'all'>> = {
  React: 'frontend',
  TypeScript: 'frontend',
  JavaScript: 'frontend',
  HTML: 'frontend',
  HTML5: 'frontend',
  CSS: 'frontend',
  CSS3: 'frontend',
  Vite: 'frontend',
  'Next.js': 'frontend',
  Vue: 'frontend',
  Nuxt: 'frontend',
  Angular: 'frontend',
  Svelte: 'frontend',
  'Tailwind CSS': 'frontend',
  Bootstrap: 'frontend',
  'Material UI': 'frontend',
  'Chakra UI': 'frontend',
  Redux: 'frontend',
  Pinia: 'frontend',
  PHP: 'backend',
  Laravel: 'backend',
  CodeIgniter: 'backend',
  'Node.js': 'backend',
  Express: 'backend',
  NestJS: 'backend',
  'Spring Boot': 'backend',
  Symfony: 'backend',
  Java: 'backend',
  Python: 'backend',
  Django: 'backend',
  Flask: 'backend',
  FastAPI: 'backend',
  Go: 'backend',
  Gin: 'backend',
  Fiber: 'backend',
  '.NET': 'backend',
  'ASP.NET Core': 'backend',
  Ruby: 'backend',
  'Ruby on Rails': 'backend',
  MySQL: 'tools',
  PostgreSQL: 'tools',
  MariaDB: 'tools',
  SQLite: 'tools',
  'SQL Server': 'tools',
  Docker: 'tools',
  Git: 'tools',
  Prisma: 'tools',
  Firebase: 'tools',
  Supabase: 'tools',
  Redis: 'tools',
  MongoDB: 'tools',
  Retrofit: 'tools',
  Room: 'tools',
  Hilt: 'tools',
  Kubernetes: 'tools',
  Terraform: 'tools',
  Jenkins: 'tools',
  'GitHub Actions': 'tools',
  'GitLab CI': 'tools',
  Kafka: 'tools',
  RabbitMQ: 'tools',
  GraphQL: 'tools',
  'Apollo GraphQL': 'tools',
  Flutter: 'mobile',
  'React Native': 'mobile',
  Android: 'mobile',
  'Jetpack Compose': 'mobile',
  Expo: 'mobile',
  Ionic: 'mobile',
  Electron: 'mobile',
};

export function getStackSection(stack: string): Exclude<StackSection, 'all'> {
  return STACK_TO_SECTION[stack] ?? 'other';
}

export function resolveSectionFilter(value: string | undefined): StackSection {
  if (!value) {
    return 'all';
  }

  const v = value.toLowerCase();

  if (v === 'all') return 'all';
  if (v === 'frontend' || v === 'fe' || v === 'ui') return 'frontend';
  if (v === 'backend' || v === 'be' || v === 'api') return 'backend';
  if (v === 'tools' || v === 'tool' || v === 'db' || v === 'database' || v === 'database-tools') return 'tools';
  if (v === 'mobile' || v === 'android' || v === 'ios') return 'mobile';
  if (v === 'other') return 'other';

  return 'all';
}

export function filterStackGroupsBySection(stackGroups: StackGroup[], section: StackSection): StackGroup[] {
  if (section === 'all') {
    return stackGroups;
  }

  return stackGroups.filter((group) => getStackSection(group.stack) === section);
}
