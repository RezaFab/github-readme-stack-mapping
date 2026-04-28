import type { CardOptions, CardTheme, RepoStackAnalysis, StackGroup } from './types';

const DEFAULT_LIGHT_THEME: CardTheme = {
  bgColor: '#ffffff',
  borderColor: '#d0d7de',
  titleColor: '#24292f',
  textColor: '#57606a',
  mutedTextColor: '#8c959f',
  sectionBgColor: '#f6f8fa',
};

const DEFAULT_DARK_THEME: CardTheme = {
  bgColor: '#0d1117',
  borderColor: '#30363d',
  titleColor: '#f0f6fc',
  textColor: '#8b949e',
  mutedTextColor: '#6e7681',
  sectionBgColor: '#161b22',
};

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;');
}

function sanitizeColor(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!HEX_COLOR_REGEX.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}

export function normalizeCardOptions(query: Record<string, string | string[] | undefined>): CardOptions {
  const get = (key: string): string | undefined => {
    const value = query[key];
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      return value[0];
    }

    return undefined;
  };

  const themeRaw = get('theme')?.toLowerCase();
  const theme = themeRaw === 'dark' ? 'dark' : 'light';

  const hideBorder = get('hide_border')?.toLowerCase() === 'true';

  const maxReposPerStackRaw = Number.parseInt(get('max_repos_per_stack') ?? '', 10);
  const maxStacksRaw = Number.parseInt(get('max_stacks') ?? '', 10);

  const maxReposPerStack = Number.isFinite(maxReposPerStackRaw)
    ? Math.min(Math.max(maxReposPerStackRaw, 1), 10)
    : 4;

  const maxStacks = Number.isFinite(maxStacksRaw) ? Math.min(Math.max(maxStacksRaw, 1), 25) : 10;

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
  const baseTheme = options.theme === 'dark' ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;

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

function formatRepoLine(repoAnalysis: RepoStackAnalysis): string {
  const { repo } = repoAnalysis;
  return `${repo.name}  ?${repo.stargazers_count}  ?${repo.forks_count}`;
}

function calculateHeight(stacksCount: number, repoLineCount: number): number {
  const headerHeight = 95;
  const stackTitleHeight = stacksCount * 30;
  const repoLinesHeight = repoLineCount * 24;
  const padding = 48;

  return headerHeight + stackTitleHeight + repoLinesHeight + padding;
}

export function renderCardSvg({ username, totalRepositories, stackGroups, options }: CardRenderInput): string {
  const width = 700;
  const theme = resolveTheme(options);

  const limitedStacks = stackGroups.slice(0, options.maxStacks);

  const repoLineCount = limitedStacks.reduce((sum, group) => {
    const shown = Math.min(group.repos.length, options.maxReposPerStack);
    const hasMore = group.repos.length > options.maxReposPerStack ? 1 : 0;
    return sum + shown + hasMore;
  }, 0);

  const height = calculateHeight(limitedStacks.length, repoLineCount);

  const lines: string[] = [];

  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">`,
  );
  lines.push(`<title id="title">GitHub Stack Mapping - ${escapeXml(username)}</title>`);
  lines.push(`<desc id="desc">Tech stack summary card for GitHub user ${escapeXml(username)}.</desc>`);

  const borderStroke = options.hideBorder ? 'none' : theme.borderColor;
  const borderWidth = options.hideBorder ? 0 : 1;

  lines.push(
    `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="14" fill="${theme.bgColor}" stroke="${borderStroke}" stroke-width="${borderWidth}"/>`,
  );

  lines.push(
    `<text x="28" y="42" fill="${theme.titleColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="24" font-weight="700">GitHub Stack Mapping - ${escapeXml(username)}</text>`,
  );
  lines.push(
    `<text x="28" y="68" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14">${totalRepositories} repositories • ${limitedStacks.length} detected stacks</text>`,
  );

  let currentY = 92;

  if (limitedStacks.length === 0) {
    lines.push(
      `<text x="28" y="${currentY + 20}" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14">No stack signals were detected from public repositories.</text>`,
    );
  }

  for (const group of limitedStacks) {
    currentY += 12;
    const sectionHeight = 24 + (Math.min(group.repos.length, options.maxReposPerStack) * 22) + (group.repos.length > options.maxReposPerStack ? 22 : 0);

    lines.push(
      `<rect x="20" y="${currentY}" width="660" height="${sectionHeight}" rx="10" fill="${theme.sectionBgColor}"/>`,
    );

    lines.push(
      `<text x="32" y="${currentY + 22}" fill="${theme.titleColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="15" font-weight="600">${escapeXml(group.stack)} (${group.repos.length})</text>`,
    );

    currentY += 44;

    const shownRepos = group.repos.slice(0, options.maxReposPerStack);
    for (const repoAnalysis of shownRepos) {
      lines.push(
        `<text x="40" y="${currentY}" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="13">• ${escapeXml(formatRepoLine(repoAnalysis))}</text>`,
      );
      currentY += 22;
    }

    if (group.repos.length > options.maxReposPerStack) {
      const remaining = group.repos.length - options.maxReposPerStack;
      lines.push(
        `<text x="40" y="${currentY}" fill="${theme.mutedTextColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="13">+${remaining} more</text>`,
      );
      currentY += 22;
    }
  }

  lines.push('</svg>');

  return lines.join('');
}

export function renderErrorSvg(message: string, options: CardOptions): string {
  const width = 700;
  const height = 180;
  const theme = resolveTheme(options);

  const safeMessage = escapeXml(message);
  const borderStroke = options.hideBorder ? 'none' : theme.borderColor;
  const borderWidth = options.hideBorder ? 0 : 1;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">`,
    '<title id="title">GitHub Stack Mapping Error</title>',
    `<desc id="desc">${safeMessage}</desc>`,
    `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="14" fill="${theme.bgColor}" stroke="${borderStroke}" stroke-width="${borderWidth}"/>`,
    `<text x="28" y="52" fill="${theme.titleColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="24" font-weight="700">GitHub Stack Mapping</text>`,
    `<text x="28" y="86" fill="#f85149" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="16" font-weight="600">Error</text>`,
    `<text x="28" y="114" fill="${theme.textColor}" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14">${safeMessage}</text>`,
    '</svg>',
  ].join('');
}
