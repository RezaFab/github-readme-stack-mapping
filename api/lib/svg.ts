import * as simpleIcons from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';
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
  fallbackIcon: string;
}

const DEFAULT_STACK_STYLE: StackStyle = {
  label: 'STACK',
  color: '334155',
  fallbackIcon: 'S',
};

const STACK_STYLES: Record<string, StackStyle> = {
  React: { label: 'REACT', color: '20232A', fallbackIcon: 'R' },
  TypeScript: { label: 'TYPESCRIPT', color: '2F74C0', fallbackIcon: 'TS' },
  JavaScript: { label: 'JAVASCRIPT', color: 'F7DF1E', fallbackIcon: 'JS' },
  'Tailwind CSS': { label: 'TAILWINDCSS', color: '0F172A', fallbackIcon: 'TW' },
  Bootstrap: { label: 'BOOTSTRAP', color: '7952B3', fallbackIcon: 'BS' },
  'Material UI': { label: 'MATERIAL UI', color: '007FFF', fallbackIcon: 'MUI' },
  'Chakra UI': { label: 'CHAKRA UI', color: '319795', fallbackIcon: 'CU' },
  Redux: { label: 'REDUX', color: '764ABC', fallbackIcon: 'RX' },
  Pinia: { label: 'PINIA', color: 'FFE56C', fallbackIcon: 'PI' },
  GraphQL: { label: 'GRAPHQL', color: 'E10098', fallbackIcon: 'GQ' },
  'Apollo GraphQL': { label: 'APOLLO', color: '311C87', fallbackIcon: 'AP' },
  HTML5: { label: 'HTML5', color: 'E34F26', fallbackIcon: 'H5' },
  CSS3: { label: 'CSS3', color: '1572B6', fallbackIcon: 'C3' },
  Vite: { label: 'VITE', color: '646CFF', fallbackIcon: 'V' },
  'Next.js': { label: 'NEXT.JS', color: '000000', fallbackIcon: 'NX' },
  Vue: { label: 'VUE', color: '4FC08D', fallbackIcon: 'VU' },
  Nuxt: { label: 'NUXT', color: '00DC82', fallbackIcon: 'NU' },
  Angular: { label: 'ANGULAR', color: 'DD0031', fallbackIcon: 'NG' },
  Svelte: { label: 'SVELTE', color: 'FF3E00', fallbackIcon: 'SV' },
  PHP: { label: 'PHP', color: '777BB4', fallbackIcon: 'PHP' },
  Laravel: { label: 'LARAVEL', color: 'FF2D20', fallbackIcon: 'LV' },
  CodeIgniter: { label: 'CODEIGNITER', color: 'DD4814', fallbackIcon: 'CI' },
  'Node.js': { label: 'NODE.JS', color: '339933', fallbackIcon: 'NJ' },
  Express: { label: 'EXPRESS', color: '000000', fallbackIcon: 'EX' },
  NestJS: { label: 'NESTJS', color: 'E0234E', fallbackIcon: 'NE' },
  'Spring Boot': { label: 'SPRING BOOT', color: '6DB33F', fallbackIcon: 'SB' },
  Symfony: { label: 'SYMFONY', color: '000000', fallbackIcon: 'SY' },
  Java: { label: 'JAVA', color: '007396', fallbackIcon: 'J' },
  Kotlin: { label: 'KOTLIN', color: '7F52FF', fallbackIcon: 'K' },
  Python: { label: 'PYTHON', color: '3776AB', fallbackIcon: 'PY' },
  Django: { label: 'DJANGO', color: '092E20', fallbackIcon: 'DJ' },
  Flask: { label: 'FLASK', color: '000000', fallbackIcon: 'FL' },
  FastAPI: { label: 'FASTAPI', color: '009688', fallbackIcon: 'FA' },
  Go: { label: 'GO', color: '00ADD8', fallbackIcon: 'GO' },
  Gin: { label: 'GIN', color: '008ECF', fallbackIcon: 'GI' },
  Fiber: { label: 'FIBER', color: '00ADEF', fallbackIcon: 'FB' },
  '.NET': { label: '.NET', color: '512BD4', fallbackIcon: '.N' },
  'ASP.NET Core': { label: 'ASP.NET', color: '512BD4', fallbackIcon: 'AS' },
  Ruby: { label: 'RUBY', color: 'CC342D', fallbackIcon: 'RB' },
  'Ruby on Rails': { label: 'RAILS', color: 'CC0000', fallbackIcon: 'RR' },
  Flutter: { label: 'FLUTTER', color: '02569B', fallbackIcon: 'FT' },
  'React Native': { label: 'REACT NATIVE', color: '20232A', fallbackIcon: 'RN' },
  Android: { label: 'ANDROID', color: '3DDC84', fallbackIcon: 'AN' },
  'Jetpack Compose': { label: 'JETPACK COMPOSE', color: '4285F4', fallbackIcon: 'JC' },
  Expo: { label: 'EXPO', color: '000020', fallbackIcon: 'EX' },
  Ionic: { label: 'IONIC', color: '3880FF', fallbackIcon: 'IO' },
  Electron: { label: 'ELECTRON', color: '47848F', fallbackIcon: 'EL' },
  Prisma: { label: 'PRISMA', color: '2D3748', fallbackIcon: 'PR' },
  MySQL: { label: 'MYSQL', color: '005C84', fallbackIcon: 'MY' },
  PostgreSQL: { label: 'POSTGRESQL', color: '316192', fallbackIcon: 'PG' },
  MariaDB: { label: 'MARIADB', color: '003545', fallbackIcon: 'MD' },
  SQLite: { label: 'SQLITE', color: '003B57', fallbackIcon: 'SQ' },
  'SQL Server': { label: 'SQL SERVER', color: 'CC2927', fallbackIcon: 'SS' },
  Docker: { label: 'DOCKER', color: '0db7ed', fallbackIcon: 'DK' },
  Git: { label: 'GIT', color: 'F1502F', fallbackIcon: 'GT' },
  Kubernetes: { label: 'KUBERNETES', color: '326CE5', fallbackIcon: 'KB' },
  Terraform: { label: 'TERRAFORM', color: '844FBA', fallbackIcon: 'TF' },
  Jenkins: { label: 'JENKINS', color: 'D24939', fallbackIcon: 'JK' },
  'GitHub Actions': { label: 'GITHUB ACTIONS', color: '2088FF', fallbackIcon: 'GA' },
  'GitLab CI': { label: 'GITLAB CI', color: 'FC6D26', fallbackIcon: 'GL' },
  Kafka: { label: 'KAFKA', color: '231F20', fallbackIcon: 'KF' },
  RabbitMQ: { label: 'RABBITMQ', color: 'FF6600', fallbackIcon: 'RQ' },
  Firebase: { label: 'FIREBASE', color: 'FFCA28', fallbackIcon: 'FB' },
  Supabase: { label: 'SUPABASE', color: '3ECF8E', fallbackIcon: 'SB' },
  Redis: { label: 'REDIS', color: 'DC382D', fallbackIcon: 'RD' },
  MongoDB: { label: 'MONGODB', color: '47A248', fallbackIcon: 'MG' },
  Retrofit: { label: 'RETROFIT', color: '3DDC84', fallbackIcon: 'RT' },
  Room: { label: 'ROOM', color: '6DB33F', fallbackIcon: 'RM' },
  Hilt: { label: 'HILT', color: '34A853', fallbackIcon: 'HL' },
};

const STACK_ICON_KEYS: Record<string, string> = {
  React: 'siReact',
  TypeScript: 'siTypescript',
  JavaScript: 'siJavascript',
  'Tailwind CSS': 'siTailwindcss',
  Bootstrap: 'siBootstrap',
  'Material UI': 'siMui',
  'Chakra UI': 'siChakraui',
  Redux: 'siRedux',
  Pinia: 'siPinia',
  GraphQL: 'siGraphql',
  'Apollo GraphQL': 'siApollographql',
  HTML5: 'siHtml5',
  CSS3: 'siCss',
  Vite: 'siVite',
  'Next.js': 'siNextdotjs',
  Vue: 'siVuedotjs',
  Nuxt: 'siNuxt',
  Angular: 'siAngular',
  Svelte: 'siSvelte',
  PHP: 'siPhp',
  Laravel: 'siLaravel',
  CodeIgniter: 'siCodeigniter',
  'Node.js': 'siNodedotjs',
  Express: 'siExpress',
  NestJS: 'siNestjs',
  'Spring Boot': 'siSpringboot',
  Symfony: 'siSymfony',
  Java: 'siOpenjdk',
  Kotlin: 'siKotlin',
  Python: 'siPython',
  Django: 'siDjango',
  Flask: 'siFlask',
  FastAPI: 'siFastapi',
  Go: 'siGo',
  Gin: 'siGin',
  '.NET': 'siDotnet',
  'ASP.NET Core': 'siDotnet',
  Ruby: 'siRuby',
  'Ruby on Rails': 'siRubyonrails',
  Flutter: 'siFlutter',
  'React Native': 'siReact',
  Android: 'siAndroid',
  'Jetpack Compose': 'siJetpackcompose',
  Expo: 'siExpo',
  Ionic: 'siIonic',
  Electron: 'siElectron',
  Prisma: 'siPrisma',
  MySQL: 'siMysql',
  PostgreSQL: 'siPostgresql',
  MariaDB: 'siMariadb',
  SQLite: 'siSqlite',
  Docker: 'siDocker',
  Git: 'siGit',
  Kubernetes: 'siKubernetes',
  Terraform: 'siTerraform',
  Jenkins: 'siJenkins',
  'GitHub Actions': 'siGithubactions',
  'GitLab CI': 'siGitlab',
  Kafka: 'siApachekafka',
  RabbitMQ: 'siRabbitmq',
  Firebase: 'siFirebase',
  Supabase: 'siSupabase',
  Redis: 'siRedis',
  MongoDB: 'siMongodb',
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

interface InlineIcon {
  path: string;
  hex: string;
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

function toHex(color: string): string {
  return color.startsWith('#') ? color : `#${color}`;
}

function normalizeHex(hex: string): string {
  const raw = hex.replace('#', '');
  if (raw.length === 3) {
    return raw.split('').map((char) => `${char}${char}`).join('');
  }
  return raw;
}

function adjustHexColor(hex: string, amount: number): string {
  const raw = normalizeHex(hex);
  const parse = (index: number): number => Number.parseInt(raw.slice(index, index + 2), 16);
  const clamp = (value: number): number => Math.max(0, Math.min(255, value));

  const r = clamp(parse(0) + amount);
  const g = clamp(parse(2) + amount);
  const b = clamp(parse(4) + amount);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function pickTextColor(bgHex: string): string {
  const raw = normalizeHex(bgHex);
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 145 ? '#0f172a' : '#f8fafc';
}

function fallbackIcon(label: string): string {
  const tokens = label.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (tokens.length === 0) return 'S';
  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
}

function getStackStyle(stack: string): StackStyle {
  const style = STACK_STYLES[stack] ?? { ...DEFAULT_STACK_STYLE, label: stack.toUpperCase() };
  return {
    ...style,
    fallbackIcon: style.fallbackIcon ?? fallbackIcon(style.label),
  };
}

function getSimpleIcon(stack: string): InlineIcon | undefined {
  const iconKey = STACK_ICON_KEYS[stack];
  if (!iconKey) {
    return undefined;
  }

  const raw = (simpleIcons as Record<string, unknown>)[iconKey] as Partial<SimpleIcon> | undefined;
  if (!raw || typeof raw.path !== 'string' || typeof raw.hex !== 'string') {
    return undefined;
  }

  return {
    path: raw.path,
    hex: raw.hex,
  };
}

function trimLabel(label: string, maxChars = 16): string {
  return label.length <= maxChars ? label : `${label.slice(0, Math.max(1, maxChars - 3))}...`;
}

function estimateBadgeWidth(stack: string, count: number): number {
  const style = getStackStyle(stack);
  const label = trimLabel(style.label, 16);
  const iconW = 28;
  const countChars = `(${count})`.length;
  const countW = Math.max(42, 18 + countChars * 7);
  const labelW = Math.min(Math.max(56, label.length * 7 + 16), 165);
  const width = iconW + labelW + countW;
  return Math.min(Math.max(width, 124), 240);
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

      const style = getStackStyle(group.stack);
      const icon = getSimpleIcon(group.stack);
      const bg = toHex(style.color);
      const countText = `(${group.repos.length})`;
      const textColor = pickTextColor(bg);
      const iconBg = adjustHexColor(bg, textColor === '#0f172a' ? -40 : 40);
      const countBg = adjustHexColor(bg, textColor === '#0f172a' ? -28 : 28);
      const iconTextColor = pickTextColor(iconBg);
      const countTextColor = pickTextColor(countBg);

      const badgeH = 28;
      const iconW = 28;
      const countW = Math.max(42, 18 + countText.length * 7);
      const countX = badgeX + badgeWidth - countW;
      const labelW = Math.max(34, countX - (badgeX + iconW));
      const maxChars = Math.max(4, Math.floor((labelW - 12) / 7));
      const label = trimLabel(style.label, maxChars);
      const labelStartX = badgeX + iconW + 8;

      lines.push(`<rect x="${badgeX}" y="${badgeY}" width="${badgeWidth}" height="${badgeH}" rx="6" fill="${bg}"/>`);
      lines.push(`<rect x="${badgeX}" y="${badgeY}" width="${iconW}" height="${badgeH}" rx="6" fill="${iconBg}"/>`);
      lines.push(`<rect x="${countX}" y="${badgeY}" width="${countW}" height="${badgeH}" rx="6" fill="${countBg}"/>`);

      if (icon) {
        const iconSize = 14;
        const scale = iconSize / 24;
        const iconX = badgeX + (iconW - iconSize) / 2;
        const iconY = badgeY + (badgeH - iconSize) / 2;
        const iconFill = toHex(icon.hex);

        lines.push(`<g transform="translate(${iconX} ${iconY}) scale(${scale})"><path d="${icon.path}" fill="${iconFill}"/></g>`);
      } else {
        lines.push(`<text x="${badgeX + 6}" y="${badgeY + 18}" fill="${iconTextColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="10" font-weight="700">${escapeXml(style.fallbackIcon)}</text>`);
      }

      lines.push(`<text x="${labelStartX}" y="${badgeY + 18}" fill="${textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="10.5" font-weight="700" letter-spacing="0.5">${escapeXml(label)}</text>`);
      lines.push(`<text x="${countX + countW / 2}" y="${badgeY + 18}" fill="${countTextColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="10.5" font-weight="700" text-anchor="middle">${countText}</text>`);

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
