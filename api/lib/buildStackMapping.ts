import { detectStacks } from './stackDetector.js';
import { fetchPublicRepositories, fetchRepoConfigFiles } from './github.js';
import type { DetectionMode, GitHubRepo, RepoStackAnalysis, StackGroup } from './types.js';

interface BuildStackMappingResult {
  repositories: GitHubRepo[];
  repoAnalyses: RepoStackAnalysis[];
  technologyGroups: StackGroup[];
  languageGroups: StackGroup[];
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

function groupByEntries(
  repoAnalyses: RepoStackAnalysis[],
  getEntries: (analysis: RepoStackAnalysis) => string[],
): StackGroup[] {
  const grouped = new Map<string, RepoStackAnalysis[]>();

  for (const analysis of repoAnalyses) {
    for (const entry of getEntries(analysis)) {
      const existing = grouped.get(entry);
      if (existing) {
        existing.push(analysis);
      } else {
        grouped.set(entry, [analysis]);
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

export function selectStackGroupsByMode(
  mode: DetectionMode,
  technologyGroups: StackGroup[],
  languageGroups: StackGroup[],
): StackGroup[] {
  if (mode === 'languages') {
    return languageGroups;
  }

  if (mode === 'all') {
    const merged = new Map<string, StackGroup>();

    for (const group of [...technologyGroups, ...languageGroups]) {
      const existing = merged.get(group.stack);
      if (!existing) {
        merged.set(group.stack, group);
        continue;
      }

      const repoMap = new Map<string, RepoStackAnalysis>();
      for (const repoAnalysis of [...existing.repos, ...group.repos]) {
        repoMap.set(repoAnalysis.repo.html_url, repoAnalysis);
      }

      existing.repos = [...repoMap.values()].sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count);
    }

    return [...merged.values()].sort((a, b) => {
      if (b.repos.length !== a.repos.length) {
        return b.repos.length - a.repos.length;
      }
      return a.stack.localeCompare(b.stack);
    });
  }

  return technologyGroups;
}

export async function buildStackMapping(
  username: string,
  token?: string,
  mode: DetectionMode = 'techstack',
): Promise<BuildStackMappingResult> {
  const repositories = await fetchPublicRepositories(username, token);

  const repoAnalyses = await mapWithConcurrency(repositories, 4, async (repo) => {
    const files = await fetchRepoConfigFiles(repo, token);
    const detected = detectStacks(repo, files);

    return {
      repo,
      technologies: detected.technologies,
      languages: detected.languages,
    };
  });

  const technologyGroups = groupByEntries(repoAnalyses, (analysis) => analysis.technologies);
  const languageGroups = groupByEntries(repoAnalyses, (analysis) => analysis.languages);
  const stackGroups = selectStackGroupsByMode(mode, technologyGroups, languageGroups);

  return {
    repositories,
    repoAnalyses,
    technologyGroups,
    languageGroups,
    stackGroups,
  };
}
