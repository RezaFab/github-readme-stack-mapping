import { buildStackMapping } from './lib/buildStackMapping.js';
import { getGitHubErrorMessage, getGitHubErrorStatus } from './lib/github.js';
import { filterStackGroupsBySection, resolveSectionFilter } from './lib/stackSection.js';
import { normalizeCardOptions, renderCardSvg, renderErrorSvg } from './lib/svg.js';
import type { ApiRequest, ApiResponse, DetectionMode, QueryValue } from './lib/types.js';

declare const process: {
  env: Record<string, string | undefined>;
};

function getQueryString(value: QueryValue): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
}

function resolveMode(value: string | undefined): DetectionMode {
  const normalized = value?.toLowerCase();

  if (normalized === 'languages') {
    return 'languages';
  }

  if (normalized === 'all') {
    return 'all';
  }

  return 'techstack';
}

function sendSvgResponse(res: ApiResponse, status: number, svg: string): void {
  res.status(status);
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.send(svg);
}

function trimForSvg(message: string): string {
  const trimmed = message.trim();
  if (trimmed.length <= 120) {
    return trimmed;
  }

  return `${trimmed.slice(0, 117)}...`;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  const options = normalizeCardOptions(req.query);
  const username = getQueryString(req.query.username)?.trim();
  const mode = resolveMode(getQueryString(req.query.mode));
  const section = resolveSectionFilter(getQueryString(req.query.section));

  if (!username) {
    const svg = renderErrorSvg('Missing "username" query parameter.', options);
    sendSvgResponse(res, 400, svg);
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const mapping = await buildStackMapping(username, token, mode);
    const filteredStackGroups = filterStackGroupsBySection(mapping.stackGroups, section);

    const svg = renderCardSvg({
      username,
      totalRepositories: mapping.repositories.length,
      stackGroups: filteredStackGroups,
      options,
    });

    sendSvgResponse(res, 200, svg);
  } catch (error: unknown) {
    const message = trimForSvg(getGitHubErrorMessage(error));
    const status = getGitHubErrorStatus(error);
    const svg = renderErrorSvg(message, options);
    sendSvgResponse(res, status, svg);
  }
}
