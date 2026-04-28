import { buildStackMapping } from './lib/buildStackMapping';
import { getGitHubErrorMessage, getGitHubErrorStatus } from './lib/github';
import { normalizeCardOptions, renderCardSvg, renderErrorSvg } from './lib/svg';
import type { ApiRequest, ApiResponse, QueryValue } from './lib/types';

function getQueryString(value: QueryValue): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return undefined;
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

  if (!username) {
    const svg = renderErrorSvg('Missing "username" query parameter.', options);
    sendSvgResponse(res, 400, svg);
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const mapping = await buildStackMapping(username, token);

    const svg = renderCardSvg({
      username,
      totalRepositories: mapping.repositories.length,
      stackGroups: mapping.stackGroups,
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
