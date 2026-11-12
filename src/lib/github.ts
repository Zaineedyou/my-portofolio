export type GitHubLanguage = {
  name: string;
  bytes: number;
  percentage: number;
};

function getRepositoryPath(repositoryUrl: string) {
  try {
    const url = new URL(repositoryUrl);
    if (url.hostname !== "github.com") return null;

    const [owner, repository] = url.pathname.split("/").filter(Boolean);
    if (!owner || !repository) return null;
    return `${owner}/${repository.replace(/\.git$/, "")}`;
  } catch {
    return null;
  }
}

export async function fetchGitHubLanguages(repositoryUrl: string, signal?: AbortSignal) {
  const repositoryPath = getRepositoryPath(repositoryUrl);
  if (!repositoryPath) throw new Error("Repository GitHub tidak ditemukan.");

  const response = await fetch(`https://api.github.com/repos/${repositoryPath}/languages`, {
    headers: { Accept: "application/vnd.github+json" },
    signal,
  });

  if (!response.ok) throw new Error(`GitHub API responded with ${response.status}.`);

  const languageBytes = (await response.json()) as Record<string, number>;
  const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);
  if (!totalBytes) return [];

  return Object.entries(languageBytes)
    .sort(([, firstBytes], [, secondBytes]) => secondBytes - firstBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
    })) satisfies GitHubLanguage[];
}
