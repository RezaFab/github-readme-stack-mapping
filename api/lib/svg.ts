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
  icon?: string;
}

const DEFAULT_STACK_STYLE: StackStyle = {
  label: 'STACK',
  color: '334155',
};

const STACK_STYLES: Record<string, StackStyle> = {
  React: { label: 'REACT', color: '20232A', icon: 'R' },
  TypeScript: { label: 'TYPESCRIPT', color: '2F74C0', icon: 'TS' },
  JavaScript: { label: 'JAVASCRIPT', color: 'F7DF1E', icon: 'JS' },
  'Tailwind CSS': { label: 'TAILWINDCSS', color: '0F172A', icon: 'TW' },
  Bootstrap: { label: 'BOOTSTRAP', color: '7952B3', icon: 'BS' },
  'Material UI': { label: 'MATERIAL UI', color: '007FFF', icon: 'MUI' },
  'Chakra UI': { label: 'CHAKRA UI', color: '319795', icon: 'CU' },
  Redux: { label: 'REDUX', color: '764ABC', icon: 'RX' },
  Pinia: { label: 'PINIA', color: 'FFE56C', icon: 'PI' },
  GraphQL: { label: 'GRAPHQL', color: 'E10098', icon: 'GQ' },
  'Apollo GraphQL': { label: 'APOLLO', color: '311C87', icon: 'AP' },
  HTML5: { label: 'HTML5', color: 'E34F26', icon: 'H5' },
  CSS3: { label: 'CSS3', color: '1572B6', icon: 'C3' },
  Vite: { label: 'VITE', color: '646CFF', icon: 'V' },
  'Next.js': { label: 'NEXT.JS', color: '000000', icon: 'NX' },
  Vue: { label: 'VUE', color: '4FC08D', icon: 'VU' },
  Nuxt: { label: 'NUXT', color: '00DC82', icon: 'NU' },
  Angular: { label: 'ANGULAR', color: 'DD0031', icon: 'NG' },
  Svelte: { label: 'SVELTE', color: 'FF3E00', icon: 'SV' },
  PHP: { label: 'PHP', color: '777BB4', icon: 'PHP' },
  Laravel: { label: 'LARAVEL', color: 'FF2D20', icon: 'LV' },
  CodeIgniter: { label: 'CODEIGNITER', color: 'DD4814', icon: 'CI' },
  'Node.js': { label: 'NODE.JS', color: '339933', icon: 'NJ' },
  Express: { label: 'EXPRESS', color: '000000', icon: 'EX' },
  NestJS: { label: 'NESTJS', color: 'E0234E', icon: 'NE' },
  'Spring Boot': { label: 'SPRING BOOT', color: '6DB33F', icon: 'SB' },
  Symfony: { label: 'SYMFONY', color: '000000', icon: 'SY' },
  Java: { label: 'JAVA', color: '007396', icon: 'J' },
  Kotlin: { label: 'KOTLIN', color: '7F52FF', icon: 'K' },
  Python: { label: 'PYTHON', color: '3776AB', icon: 'PY' },
  Django: { label: 'DJANGO', color: '092E20', icon: 'DJ' },
  Flask: { label: 'FLASK', color: '000000', icon: 'FL' },
  FastAPI: { label: 'FASTAPI', color: '009688', icon: 'FA' },
  Go: { label: 'GO', color: '00ADD8', icon: 'GO' },
  Gin: { label: 'GIN', color: '008ECF', icon: 'GI' },
  Fiber: { label: 'FIBER', color: '00ADEF', icon: 'FB' },
  '.NET': { label: '.NET', color: '512BD4', icon: '.N' },
  'ASP.NET Core': { label: 'ASP.NET', color: '512BD4', icon: 'AS' },
  Ruby: { label: 'RUBY', color: 'CC342D', icon: 'RB' },
  'Ruby on Rails': { label: 'RAILS', color: 'CC0000', icon: 'RR' },
  Flutter: { label: 'FLUTTER', color: '02569B', icon: 'FT' },
  'React Native': { label: 'REACT NATIVE', color: '20232A', icon: 'RN' },
  Android: { label: 'ANDROID', color: '3DDC84', icon: 'AN' },
  'Jetpack Compose': { label: 'JETPACK COMPOSE', color: '4285F4', icon: 'JC' },
  Expo: { label: 'EXPO', color: '000020', icon: 'EX' },
  Ionic: { label: 'IONIC', color: '3880FF', icon: 'IO' },
  Electron: { label: 'ELECTRON', color: '47848F', icon: 'EL' },
  Prisma: { label: 'PRISMA', color: '2D3748', icon: 'PR' },
  MySQL: { label: 'MYSQL', color: '005C84', icon: 'MY' },
  PostgreSQL: { label: 'POSTGRESQL', color: '316192', icon: 'PG' },
  MariaDB: { label: 'MARIADB', color: '003545', icon: 'MD' },
  SQLite: { label: 'SQLITE', color: '003B57', icon: 'SQ' },
  'SQL Server': { label: 'SQL SERVER', color: 'CC2927', icon: 'SS' },
  Docker: { label: 'DOCKER', color: '0db7ed', icon: 'DK' },
  Git: { label: 'GIT', color: 'F1502F', icon: 'GT' },
  Kubernetes: { label: 'KUBERNETES', color: '326CE5', icon: 'KB' },
  Terraform: { label: 'TERRAFORM', color: '844FBA', icon: 'TF' },
  Jenkins: { label: 'JENKINS', color: 'D24939', icon: 'JK' },
  'GitHub Actions': { label: 'GITHUB ACTIONS', color: '2088FF', icon: 'GA' },
  'GitLab CI': { label: 'GITLAB CI', color: 'FC6D26', icon: 'GL' },
  Kafka: { label: 'KAFKA', color: '231F20', icon: 'KF' },
  RabbitMQ: { label: 'RABBITMQ', color: 'FF6600', icon: 'RM' },
  Firebase: { label: 'FIREBASE', color: 'FFCA28', icon: 'FB' },
  Supabase: { label: 'SUPABASE', color: '3ECF8E', icon: 'SB' },
  Redis: { label: 'REDIS', color: 'DC382D', icon: 'RD' },
  MongoDB: { label: 'MONGODB', color: '47A248', icon: 'MG' },
  Retrofit: { label: 'RETROFIT', color: '3DDC84', icon: 'RT' },
  Room: { label: 'ROOM', color: '6DB33F', icon: 'RM' },
  Hilt: { label: 'HILT', color: '34A853', icon: 'HL' },
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
    icon: style.icon ?? fallbackIcon(style.label),
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

      lines.push(`<text x="${badgeX + 6}" y="${badgeY + 18}" fill="${iconTextColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="10" font-weight="700">${escapeXml(style.icon ?? 'S')}</text>`);
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
