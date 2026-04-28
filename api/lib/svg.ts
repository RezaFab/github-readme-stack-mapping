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
  titleColor: '#93c5fd',
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
  textColor: string;
}

const DEFAULT_STACK_STYLE: StackStyle = {
  label: 'Stack',
  color: '#334155',
  textColor: '#ffffff',
};

const STACK_STYLES: Record<string, StackStyle> = {
  React: { label: 'React', color: '#20232A', textColor: '#61DAFB' },
  TypeScript: { label: 'TypeScript', color: '#2F74C0', textColor: '#ffffff' },
  JavaScript: { label: 'JavaScript', color: '#F7DF1E', textColor: '#111827' },
  'Tailwind CSS': { label: 'TailwindCSS', color: '#0F172A', textColor: '#38BDF8' },
  HTML5: { label: 'HTML5', color: '#E34F26', textColor: '#ffffff' },
  CSS3: { label: 'CSS3', color: '#1572B6', textColor: '#ffffff' },
  Vite: { label: 'Vite', color: '#646CFF', textColor: '#ffffff' },
  'Next.js': { label: 'Next.js', color: '#000000', textColor: '#ffffff' },
  Vue: { label: 'Vue', color: '#4FC08D', textColor: '#ffffff' },
  Nuxt: { label: 'Nuxt', color: '#00DC82', textColor: '#0B1220' },
  Angular: { label: 'Angular', color: '#DD0031', textColor: '#ffffff' },
  Svelte: { label: 'Svelte', color: '#FF3E00', textColor: '#ffffff' },
  PHP: { label: 'PHP', color: '#777BB4', textColor: '#ffffff' },
  Laravel: { label: 'Laravel', color: '#FF2D20', textColor: '#ffffff' },
  CodeIgniter: { label: 'CodeIgniter', color: '#DD4814', textColor: '#ffffff' },
  'Node.js': { label: 'Node.js', color: '#339933', textColor: '#ffffff' },
  Express: { label: 'Express', color: '#000000', textColor: '#ffffff' },
  NestJS: { label: 'NestJS', color: '#E0234E', textColor: '#ffffff' },
  'Spring Boot': { label: 'Spring Boot', color: '#6DB33F', textColor: '#ffffff' },
  Symfony: { label: 'Symfony', color: '#000000', textColor: '#ffffff' },
  Java: { label: 'Java', color: '#007396', textColor: '#ffffff' },
  Kotlin: { label: 'Kotlin', color: '#7F52FF', textColor: '#ffffff' },
  Python: { label: 'Python', color: '#3776AB', textColor: '#ffffff' },
  Django: { label: 'Django', color: '#092E20', textColor: '#ffffff' },
  Flask: { label: 'Flask', color: '#111827', textColor: '#ffffff' },
  FastAPI: { label: 'FastAPI', color: '#009688', textColor: '#ffffff' },
  Flutter: { label: 'Flutter', color: '#02569B', textColor: '#ffffff' },
  'React Native': { label: 'React Native', color: '#20232A', textColor: '#61DAFB' },
  Android: { label: 'Android', color: '#3DDC84', textColor: '#0A1A13' },
  'Jetpack Compose': { label: 'Jetpack Compose', color: '#4285F4', textColor: '#ffffff' },
  Prisma: { label: 'Prisma', color: '#2D3748', textColor: '#ffffff' },
  MySQL: { label: 'MySQL', color: '#005C84', textColor: '#ffffff' },
  PostgreSQL: { label: 'PostgreSQL', color: '#316192', textColor: '#ffffff' },
  'SQL Server': { label: 'SQL Server', color: '#CC2927', textColor: '#ffffff' },
  Docker: { label: 'Docker', color: '#0db7ed', textColor: '#ffffff' },
  Git: { label: 'Git', color: '#F1502F', textColor: '#ffffff' },
  Firebase: { label: 'Firebase', color: '#FFCA28', textColor: '#111827' },
  Redis: { label: 'Redis', color: '#DC382D', textColor: '#ffffff' },
  MongoDB: { label: 'MongoDB', color: '#47A248', textColor: '#ffffff' },
  Retrofit: { label: 'Retrofit', color: '#3DDC84', textColor: '#0A1A13' },
  Room: { label: 'Room', color: '#6DB33F', textColor: '#ffffff' },
  Hilt: { label: 'Hilt', color: '#34A853', textColor: '#ffffff' },
};

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

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 3)}...`;
}

function getStackStyle(stack: string): StackStyle {
  return STACK_STYLES[stack] ?? { ...DEFAULT_STACK_STYLE, label: stack };
}

function estimateChipWidth(stack: string, count: number): number {
  const style = getStackStyle(stack);
  const text = `${style.label.toUpperCase()} (${count})`;
  const width = 28 + text.length * 7;
  return Math.min(Math.max(width, 120), 230);
}

function formatRepoLine(group: StackGroup, maxRepos: number): string {
  const visible = group.repos.slice(0, maxRepos).map((item) => item.repo.name);
  const hidden = Math.max(0, group.repos.length - visible.length);
  const joined = visible.join(', ');
  const suffix = hidden > 0 ? `, +${hidden} more` : '';
  return `${group.stack}: ${joined}${suffix}`;
}

function panelFill(options: CardOptions, theme: CardTheme): string {
  if (options.theme === 'dark' && !options.bgColor) return 'url(#card-bg-dark)';
  return theme.bgColor;
}

interface SectionRender {
  key: SectionKey;
  title: string;
  groups: StackGroup[];
}

function buildSections(stackGroups: StackGroup[]): SectionRender[] {
  const map = new Map<SectionKey, StackGroup[]>();

  for (const key of SECTION_ORDER) {
    map.set(key, []);
  }

  for (const group of stackGroups) {
    const key = getStackSection(group.stack);
    const section = key === 'other' || key === 'mobile' || key === 'frontend' || key === 'backend' || key === 'tools' ? key : 'other';
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

interface CardRenderInput {
  username: string;
  totalRepositories: number;
  stackGroups: StackGroup[];
  options: CardOptions;
}

export function renderCardSvg({ username, totalRepositories, stackGroups, options }: CardRenderInput): string {
  const width = 700;
  const theme = resolveTheme(options);
  const limitedStacks = stackGroups.slice(0, options.maxStacks);
  const sections = buildSections(limitedStacks);
  const maxRepos = Math.min(options.maxReposPerStack, 6);

  const content: string[] = [];

  content.push(`<text x="28" y="48" fill="${theme.titleColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="24" font-weight="700">GitHub Stack Mapping</text>`);
  content.push(`<text x="28" y="72" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14">${escapeXml(username)} | ${totalRepositories} repos | ${limitedStacks.length} stacks</text>`);

  if (sections.length === 0) {
    content.push(`<text x="28" y="110" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14">No stack signals were detected from public repositories.</text>`);
  }

  let y = 104;

  for (const section of sections) {
    y += 26;
    content.push(`<rect x="28" y="${y - 15}" width="6" height="20" rx="3" fill="${theme.titleColor}"/>`);
    content.push(`<text x="40" y="${y}" fill="${theme.titleColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="18" font-weight="700">${escapeXml(section.title)}</text>`);
    content.push(`<line x1="155" y1="${y - 6}" x2="672" y2="${y - 6}" stroke="${theme.borderColor}" stroke-width="1"/>`);

    let chipX = 28;
    let chipY = y + 10;

    for (const group of section.groups) {
      const style = getStackStyle(group.stack);
      const chipWidth = estimateChipWidth(group.stack, group.repos.length);

      if (chipX + chipWidth > 672) {
        chipX = 28;
        chipY += 30;
      }

      const chipLabel = `${style.label.toUpperCase()} (${group.repos.length})`;

      content.push(`<rect x="${chipX}" y="${chipY}" width="${chipWidth}" height="24" rx="6" fill="${style.color}"/>`);
      content.push(`<text x="${chipX + 10}" y="${chipY + 16}" fill="${style.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="11.5" font-weight="700" letter-spacing="0.8">${escapeXml(chipLabel)}</text>`);

      chipX += chipWidth + 8;
    }

    y = chipY + 34;

    for (const group of section.groups) {
      const line = truncate(formatRepoLine(group, maxRepos), 96);
      content.push(`<text x="34" y="${y}" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="12.5">- ${escapeXml(line)}</text>`);
      y += 17;
    }

    y += 4;
  }

  y += 8;
  content.push(`<text x="28" y="${y}" fill="${theme.mutedTextColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="11">Generated by github-readme-stack-mapping</text>`);

  const finalHeight = Math.max(230, y + 20);
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
    `<desc id="desc">Embeddable tech-stack SVG summary for GitHub user ${escapeXml(username)}.</desc>`,
    `<rect x="0.5" y="0.5" width="699" height="${finalHeight - 1}" rx="16" fill="${panelFill(options, theme)}" stroke="${borderStroke}" stroke-width="${borderWidth}"/>`,
    '<rect x="18" y="18" width="664" height="1" fill="url(#header-glow)"/>',
    ...content,
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
    `<text x="28" y="52" fill="${theme.titleColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="24" font-weight="700">GitHub Stack Mapping</text>`,
    '<text x="28" y="86" fill="#f85149" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="16" font-weight="600">Error</text>',
    `<text x="28" y="116" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14">${safeMessage}</text>`,
    '</svg>',
  ].join('');
}
