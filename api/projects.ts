import { buildStackMapping } from './lib/buildStackMapping.js';
import { getGitHubErrorMessage, getGitHubErrorStatus } from './lib/github.js';
import { filterStackGroupsBySection, resolveSectionFilter } from './lib/stackSection.js';
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

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  const username = getQueryString(req.query.username)?.trim();
  const mode = resolveMode(getQueryString(req.query.mode));
  const section = resolveSectionFilter(getQueryString(req.query.section));

  if (!username) {
    res.status(400);
    res.json({
      error: 'Missing "username" query parameter.',
    });
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const mapping = await buildStackMapping(username, token, mode);
    const filteredStackGroups = filterStackGroupsBySection(mapping.stackGroups, section);

    res.status(200);
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.json({
      username,
      mode,
      section,
      totalRepositories: mapping.repositories.length,
      totalStacks: filteredStackGroups.length,
      totalTechnologies: mapping.technologyGroups.length,
      totalLanguages: mapping.languageGroups.length,
      stackGroups: filteredStackGroups.map((group) => ({
        stack: group.stack,
        repositoryCount: group.repos.length,
        repositories: group.repos.map(({ repo, technologies, languages }) => ({
          ...repo,
          detected: {
            technologies,
            languages,
          },
        })),
      })),
      technologyGroups: mapping.technologyGroups.map((group) => ({
        stack: group.stack,
        repositoryCount: group.repos.length,
      })),
      languageGroups: mapping.languageGroups.map((group) => ({
        stack: group.stack,
        repositoryCount: group.repos.length,
      })),
    });
  } catch (error: unknown) {
    res.status(getGitHubErrorStatus(error));
    res.json({
      error: getGitHubErrorMessage(error),
    });
  }
}
