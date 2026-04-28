import { getStackSection } from './stackSection.js';
import type { CardOptions, CardTheme, StackGroup } from './types.js';

const DEFAULT_LIGHT_THEME: CardTheme = {
  bgColor: '#f8fafc',
  borderColor: '#d0d7de',
  titleColor: '#1f2937',
  textColor: '#475569',
  mutedTextColor: '#64748b',
  sectionBgColor: '#ffffff',
};

const DEFAULT_DARK_THEME: CardTheme = {
  bgColor: '#070b16',
  borderColor: '#243049',
  titleColor: '#e2e8f0',
  textColor: '#9dd8ff',
  mutedTextColor: '#7fb2d8',
  sectionBgColor: '#11182c',
};

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

type SectionKey = 'frontend' | 'backend' | 'tools' | 'mobile' | 'other';

const SECTION_ORDER: SectionKey[] = ['frontend', 'backend', 'mobile', 'tools', 'other'];

const SECTION_TITLES: Record<SectionKey, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  tools: 'Database & Tools',
  other: 'Other',
};

interface StackStyle {
  label: string;
  color: string;
  logo: string;
  logoColor: string;
}

const DEFAULT_STACK_STYLE: StackStyle = {
  label: 'Stack',
  color: '334155',
  logo: 'github',
  logoColor: 'white',
};

const STACK_STYLES: Record<string, StackStyle> = {
  React: { label: 'REACT', color: '20232A', logo: 'react', logoColor: '61DAFB' },
  TypeScript: { label: 'TYPESCRIPT', color: '2F74C0', logo: 'typescript', logoColor: 'white' },
  JavaScript: { label: 'JAVASCRIPT', color: 'F7DF1E', logo: 'javascript', logoColor: 'black' },
  'Tailwind CSS': { label: 'TAILWINDCSS', color: '0F172A', logo: 'tailwindcss', logoColor: '38BDF8' },
  Bootstrap: { label: 'BOOTSTRAP', color: '7952B3', logo: 'bootstrap', logoColor: 'white' },
  'Material UI': { label: 'MATERIAL UI', color: '007FFF', logo: 'mui', logoColor: 'white' },
  'Chakra UI': { label: 'CHAKRA UI', color: '319795', logo: 'chakraui', logoColor: 'white' },
  Redux: { label: 'REDUX', color: '764ABC', logo: 'redux', logoColor: 'white' },
  Pinia: { label: 'PINIA', color: 'FFE56C', logo: 'pinia', logoColor: 'black' },
  GraphQL: { label: 'GRAPHQL', color: 'E10098', logo: 'graphql', logoColor: 'white' },
  'Apollo GraphQL': { label: 'APOLLO', color: '311C87', logo: 'apollographql', logoColor: 'white' },
  HTML5: { label: 'HTML5', color: 'E34F26', logo: 'html5', logoColor: 'white' },
  CSS3: { label: 'CSS3', color: '1572B6', logo: 'css3', logoColor: 'white' },
  Vite: { label: 'VITE', color: '646CFF', logo: 'vite', logoColor: 'white' },
  'Next.js': { label: 'NEXT.JS', color: '000000', logo: 'nextdotjs', logoColor: 'white' },
  Vue: { label: 'VUE', color: '4FC08D', logo: 'vuedotjs', logoColor: 'white' },
  Nuxt: { label: 'NUXT', color: '00DC82', logo: 'nuxtdotjs', logoColor: 'white' },
  Angular: { label: 'ANGULAR', color: 'DD0031', logo: 'angular', logoColor: 'white' },
  Svelte: { label: 'SVELTE', color: 'FF3E00', logo: 'svelte', logoColor: 'white' },
  PHP: { label: 'PHP', color: '777BB4', logo: 'php', logoColor: 'white' },
  Laravel: { label: 'LARAVEL', color: 'FF2D20', logo: 'laravel', logoColor: 'white' },
  CodeIgniter: { label: 'CODEIGNITER', color: 'DD4814', logo: 'codeigniter', logoColor: 'white' },
  'Node.js': { label: 'NODE.JS', color: '339933', logo: 'nodedotjs', logoColor: 'white' },
  Express: { label: 'EXPRESS', color: '000000', logo: 'express', logoColor: 'white' },
  NestJS: { label: 'NESTJS', color: 'E0234E', logo: 'nestjs', logoColor: 'white' },
  'Spring Boot': { label: 'SPRING BOOT', color: '6DB33F', logo: 'springboot', logoColor: 'white' },
  Symfony: { label: 'SYMFONY', color: '000000', logo: 'symfony', logoColor: 'white' },
  Java: { label: 'JAVA', color: '007396', logo: 'openjdk', logoColor: 'white' },
  Kotlin: { label: 'KOTLIN', color: '7F52FF', logo: 'kotlin', logoColor: 'white' },
  Python: { label: 'PYTHON', color: '3776AB', logo: 'python', logoColor: 'white' },
  Django: { label: 'DJANGO', color: '092E20', logo: 'django', logoColor: 'white' },
  Flask: { label: 'FLASK', color: '000000', logo: 'flask', logoColor: 'white' },
  FastAPI: { label: 'FASTAPI', color: '009688', logo: 'fastapi', logoColor: 'white' },
  Go: { label: 'GO', color: '00ADD8', logo: 'go', logoColor: 'white' },
  Gin: { label: 'GIN', color: '008ECF', logo: 'gin', logoColor: 'white' },
  Fiber: { label: 'FIBER', color: '00ADEF', logo: 'go', logoColor: 'white' },
  '.NET': { label: '.NET', color: '512BD4', logo: 'dotnet', logoColor: 'white' },
  'ASP.NET Core': { label: 'ASP.NET', color: '512BD4', logo: 'dotnet', logoColor: 'white' },
  Ruby: { label: 'RUBY', color: 'CC342D', logo: 'ruby', logoColor: 'white' },
  'Ruby on Rails': { label: 'RAILS', color: 'CC0000', logo: 'rubyonrails', logoColor: 'white' },
  Flutter: { label: 'FLUTTER', color: '02569B', logo: 'flutter', logoColor: 'white' },
  'React Native': { label: 'REACT NATIVE', color: '20232A', logo: 'react', logoColor: '61DAFB' },
  Android: { label: 'ANDROID', color: '3DDC84', logo: 'android', logoColor: 'white' },
  'Jetpack Compose': { label: 'JETPACK COMPOSE', color: '4285F4', logo: 'jetpackcompose', logoColor: 'white' },
  Expo: { label: 'EXPO', color: '000020', logo: 'expo', logoColor: 'white' },
  Ionic: { label: 'IONIC', color: '3880FF', logo: 'ionic', logoColor: 'white' },
  Electron: { label: 'ELECTRON', color: '47848F', logo: 'electron', logoColor: 'white' },
  Prisma: { label: 'PRISMA', color: '2D3748', logo: 'prisma', logoColor: 'white' },
  MySQL: { label: 'MYSQL', color: '005C84', logo: 'mysql', logoColor: 'white' },
  PostgreSQL: { label: 'POSTGRESQL', color: '316192', logo: 'postgresql', logoColor: 'white' },
  MariaDB: { label: 'MARIADB', color: '003545', logo: 'mariadb', logoColor: 'white' },
  SQLite: { label: 'SQLITE', color: '003B57', logo: 'sqlite', logoColor: 'white' },
  'SQL Server': { label: 'SQL SERVER', color: 'CC2927', logo: 'microsoftsqlserver', logoColor: 'white' },
  Docker: { label: 'DOCKER', color: '0db7ed', logo: 'docker', logoColor: 'white' },
  Git: { label: 'GIT', color: 'F1502F', logo: 'git', logoColor: 'white' },
  Kubernetes: { label: 'KUBERNETES', color: '326CE5', logo: 'kubernetes', logoColor: 'white' },
  Terraform: { label: 'TERRAFORM', color: '844FBA', logo: 'terraform', logoColor: 'white' },
  Jenkins: { label: 'JENKINS', color: 'D24939', logo: 'jenkins', logoColor: 'white' },
  'GitHub Actions': { label: 'GITHUB ACTIONS', color: '2088FF', logo: 'githubactions', logoColor: 'white' },
  'GitLab CI': { label: 'GITLAB CI', color: 'FC6D26', logo: 'gitlab', logoColor: 'white' },
  Kafka: { label: 'KAFKA', color: '231F20', logo: 'apachekafka', logoColor: 'white' },
  RabbitMQ: { label: 'RABBITMQ', color: 'FF6600', logo: 'rabbitmq', logoColor: 'white' },
  Firebase: { label: 'FIREBASE', color: 'FFCA28', logo: 'firebase', logoColor: 'black' },
  Supabase: { label: 'SUPABASE', color: '3ECF8E', logo: 'supabase', logoColor: 'white' },
  Redis: { label: 'REDIS', color: 'DC382D', logo: 'redis', logoColor: 'white' },
  MongoDB: { label: 'MONGODB', color: '47A248', logo: 'mongodb', logoColor: 'white' },
  Retrofit: { label: 'RETROFIT', color: '3DDC84', logo: 'android', logoColor: 'white' },
  Room: { label: 'ROOM', color: '6DB33F', logo: 'android', logoColor: 'white' },
  Hilt: { label: 'HILT', color: '34A853', logo: 'google', logoColor: 'white' },
};

interface SectionRender {
  key: SectionKey;
  title: string;
  groups: StackGroup[];
}

interface CardRenderInput {
  username: string;
  totalRepositories: number;
  stackGroups: StackGroup[];
  options: CardOptions;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;');
}

function sanitizeColor(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return HEX_COLOR_REGEX.test(trimmed) ? trimmed : undefined;
}

function panelFill(options: CardOptions, theme: CardTheme): string {
  if (options.theme === 'dark' && !options.bgColor) return 'url(#card-bg-dark)';
  return theme.bgColor;
}

function getStackStyle(stack: string): StackStyle {
  return STACK_STYLES[stack] ?? { ...DEFAULT_STACK_STYLE, label: stack.toUpperCase() };
}

function buildBadgeUrl(stack: string, count: number): string {
  const style = getStackStyle(stack);
  const params = new URLSearchParams({
    label: '',
    message: `${style.label} (${count})`,
    color: style.color,
    style: 'for-the-badge',
    logo: style.logo,
    logoColor: style.logoColor,
  });
  return `https://img.shields.io/static/v1?${params.toString()}`;
}

function estimateBadgeWidth(stack: string, count: number): number {
  const style = getStackStyle(stack);
  const textLength = `${style.label} (${count})`.length;
  return Math.min(Math.max(85 + textLength * 7.2, 125), 260);
}

function buildSections(stackGroups: StackGroup[]): SectionRender[] {
  const map = new Map<SectionKey, StackGroup[]>();

  for (const key of SECTION_ORDER) {
    map.set(key, []);
  }

  for (const group of stackGroups) {
    const key = getStackSection(group.stack);
    const section: SectionKey =
      key === 'frontend' || key === 'backend' || key === 'tools' || key === 'mobile' || key === 'other'
        ? key
        : 'other';
    map.get(section)?.push(group);
  }

  return SECTION_ORDER
    .map((key) => ({
      key,
      title: SECTION_TITLES[key],
      groups: (map.get(key) ?? []).sort((a, b) => {
        if (b.repos.length !== a.repos.length) {
          return b.repos.length - a.repos.length;
        }
        return a.stack.localeCompare(b.stack);
      }),
    }))
    .filter((section) => section.groups.length > 0);
}

export function normalizeCardOptions(query: Record<string, string | string[] | undefined>): CardOptions {
  const get = (key: string): string | undefined => {
    const value = query[key];
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value[0];
    return undefined;
  };

  const themeRaw = get('theme')?.toLowerCase();
  const theme = themeRaw === 'light' ? 'light' : 'dark';
  const hideBorder = get('hide_border')?.toLowerCase() === 'true';

  const maxReposPerStackRaw = Number.parseInt(get('max_repos_per_stack') ?? '', 10);
  const maxStacksRaw = Number.parseInt(get('max_stacks') ?? '', 10);

  const maxReposPerStack = Number.isFinite(maxReposPerStackRaw)
    ? Math.min(Math.max(maxReposPerStackRaw, 1), 10)
    : 5;
  const maxStacks = Number.isFinite(maxStacksRaw)
    ? Math.min(Math.max(maxStacksRaw, 1), 40)
    : 25;

  return {
    theme,
    hideBorder,
    titleColor: sanitizeColor(get('title_color')),
    textColor: sanitizeColor(get('text_color')),
    bgColor: sanitizeColor(get('bg_color')),
    borderColor: sanitizeColor(get('border_color')),
    maxReposPerStack,
    maxStacks,
  };
}

function resolveTheme(options: CardOptions): CardTheme {
  const baseTheme = options.theme === 'light' ? DEFAULT_LIGHT_THEME : DEFAULT_DARK_THEME;
  return {
    ...baseTheme,
    bgColor: options.bgColor ?? baseTheme.bgColor,
    borderColor: options.borderColor ?? baseTheme.borderColor,
    titleColor: options.titleColor ?? baseTheme.titleColor,
    textColor: options.textColor ?? baseTheme.textColor,
  };
}

function sectionDividerX(title: string): number {
  return Math.min(646, 42 + title.length * 10 + 26);
}

export function renderCardSvg({ username, totalRepositories, stackGroups, options }: CardRenderInput): string {
  const width = 700;
  const theme = resolveTheme(options);
  const limitedStacks = stackGroups.slice(0, options.maxStacks);
  const sections = buildSections(limitedStacks);

  const lines: string[] = [];


  if (sections.length === 0) {
    lines.push(`<text x="24" y="58" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14">No stack signals were detected from public repositories.</text>`);
  }

  let y = 16;

  for (const section of sections) {
    y += 20;
    lines.push(`<text x="24" y="${y}" fill="${theme.titleColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="18" font-weight="700">${escapeXml(section.title)}</text>`);
    lines.push(`<line x1="${sectionDividerX(section.title)}" y1="${y - 7}" x2="676" y2="${y - 7}" stroke="${theme.borderColor}" stroke-width="1"/>`);

    let badgeX = 24;
    let badgeY = y + 10;

    for (const group of section.groups) {
      const badgeWidth = estimateBadgeWidth(group.stack, group.repos.length);
      if (badgeX + badgeWidth > 676) {
        badgeX = 24;
        badgeY += 38;
      }

      const badgeUrl = buildBadgeUrl(group.stack, group.repos.length);
      lines.push(`<image x="${badgeX}" y="${badgeY}" width="${badgeWidth}" height="28" preserveAspectRatio="xMinYMin meet" href="${escapeXml(badgeUrl)}"/>`);

      badgeX += badgeWidth + 6;
    }

    y = badgeY + 34;
  }

  y += 6;

  const finalHeight = Math.max(190, y + 14);
  const borderStroke = options.hideBorder ? 'none' : theme.borderColor;
  const borderWidth = options.hideBorder ? 0 : 1;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg width="${width}" height="${finalHeight}" viewBox="0 0 ${width} ${finalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">`,
    '<defs>',
    '<linearGradient id="card-bg-dark" x1="0" y1="0" x2="700" y2="1000" gradientUnits="userSpaceOnUse">',
    '<stop stop-color="#0A1020"/>',
    '<stop offset="1" stop-color="#070B16"/>',
    '</linearGradient>',
    '<linearGradient id="header-glow" x1="0" y1="0" x2="700" y2="0" gradientUnits="userSpaceOnUse">',
    '<stop stop-color="#60A5FA" stop-opacity="0.34"/>',
    '<stop offset="1" stop-color="#A855F7" stop-opacity="0.18"/>',
    '</linearGradient>',
    '</defs>',
    `<title id="title">GitHub Stack Mapping - ${escapeXml(username)}</title>`,
    `<desc id="desc">Embeddable tech-stack SVG summary for GitHub user ${escapeXml(username)} with ${totalRepositories} repositories and ${limitedStacks.length} stacks.</desc>`,
    `<rect x="0.5" y="0.5" width="699" height="${finalHeight - 1}" rx="16" fill="${panelFill(options, theme)}" stroke="${borderStroke}" stroke-width="${borderWidth}"/>`,
    '<rect x="18" y="18" width="664" height="1" fill="url(#header-glow)"/>',
    ...lines,
    '</svg>',
  ].join('');
}

export function renderErrorSvg(message: string, options: CardOptions): string {
  const width = 700;
  const height = 190;
  const theme = resolveTheme(options);

  const safeMessage = escapeXml(message);
  const borderStroke = options.hideBorder ? 'none' : theme.borderColor;
  const borderWidth = options.hideBorder ? 0 : 1;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">`,
    '<title id="title">GitHub Stack Mapping Error</title>',
    `<desc id="desc">${safeMessage}</desc>`,
    `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="16" fill="${theme.bgColor}" stroke="${borderStroke}" stroke-width="${borderWidth}"/>`,
    '<text x="28" y="86" fill="#f85149" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="16" font-weight="600">Error</text>',
    `<text x="28" y="116" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14">${safeMessage}</text>`,
    '</svg>',
  ].join('');
}



