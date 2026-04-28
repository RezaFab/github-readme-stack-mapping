import { detectStacks } from './stackDetector';
import { fetchPublicRepositories, fetchRepoConfigFiles } from './github';
import type { GitHubRepo, RepoStackAnalysis, StackGroup } from './types';

interface BuildStackMappingResult {
  repositories: GitHubRepo[];
  repoAnalyses: RepoStackAnalysis[];
  stackGroups: StackGroup[];
}

async function mapWithConcurrency<TInput, TOutput>(
  items: TInput[],
  concurrency: number,
  mapper: (item: TInput, index: number) => Promise<TOutput>,
): Promise<TOutput[]> {
  const results: TOutput[] = new Array(items.length);
  let currentIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = currentIndex;
      currentIndex += 1;

      if (index >= items.length) {
        return;
      }

      results[index] = await mapper(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker());
  await Promise.all(workers);

  return results;
}

function groupByStack(repoAnalyses: RepoStackAnalysis[]): StackGroup[] {
  const grouped = new Map<string, RepoStackAnalysis[]>();

  for (const analysis of repoAnalyses) {
    for (const stack of analysis.stacks) {
      const existing = grouped.get(stack);
      if (existing) {
        existing.push(analysis);
      } else {
        grouped.set(stack, [analysis]);
      }
    }
  }

  return [...grouped.entries()]
    .map(([stack, repos]) => ({
      stack,
      repos: [...repos].sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count),
    }))
    .sort((a, b) => {
      if (b.repos.length !== a.repos.length) {
        return b.repos.length - a.repos.length;
      }

      return a.stack.localeCompare(b.stack);
    });
}

export async function buildStackMapping(username: string, token?: string): Promise<BuildStackMappingResult> {
  const repositories = await fetchPublicRepositories(username, token);

  const repoAnalyses = await mapWithConcurrency(repositories, 4, async (repo) => {
    const files = await fetchRepoConfigFiles(repo, token);
    const stacks = detectStacks(repo, files);

    return {
      repo,
      stacks,
    };
  });

  const stackGroups = groupByStack(repoAnalyses);

  return {
    repositories,
    repoAnalyses,
    stackGroups,
  };
}
