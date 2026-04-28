import { buildStackMapping } from './lib/buildStackMapping';
import { getGitHubErrorMessage, getGitHubErrorStatus } from './lib/github';
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

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  const username = getQueryString(req.query.username)?.trim();

  if (!username) {
    res.status(400);
    res.json({
      error: 'Missing "username" query parameter.',
    });
    return;
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const mapping = await buildStackMapping(username, token);

    res.status(200);
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.json({
      username,
      totalRepositories: mapping.repositories.length,
      totalStacks: mapping.stackGroups.length,
      stackGroups: mapping.stackGroups.map((group) => ({
        stack: group.stack,
        repositoryCount: group.repos.length,
        repositories: group.repos.map(({ repo, stacks }) => ({
          ...repo,
          stacks,
        })),
      })),
    });
  } catch (error: unknown) {
    res.status(getGitHubErrorStatus(error));
    res.json({
      error: getGitHubErrorMessage(error),
    });
  }
}
