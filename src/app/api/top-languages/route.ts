import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { env } from "@/env";

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

const getTopLanguages = async (username: string) => {
  const repos = await octokit.repos.listForUser({ username });
  const languageCounts: Record<string, number> = {};

  for (const repo of repos.data) {
    const { data: languages } = await octokit.repos.listLanguages({
      owner: username,
      repo: repo.name,
    });

    for (const [language, bytes] of Object.entries(languages)) {
      languageCounts[language] = (languageCounts[language] || 0) + bytes;
    }
  }

  return Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([language]) => language);
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "GitHub token is not configured" },
        { status: 500 }
      );
    }

    const languages = await getTopLanguages(username);

    return NextResponse.json({ languages });
  } catch (error) {
    console.error("Error fetching top languages:", error);
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}
