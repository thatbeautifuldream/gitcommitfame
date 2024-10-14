import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function GET() {
  try {
    const { data: contributors } = await octokit.repos.getContributorsStats({
      owner: "vercel",
      repo: "next.js",
    });

    const topContributors = contributors
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map((contributor) => ({
        username: contributor?.author?.login,
        avatarUrl: contributor?.author?.avatar_url,
        commits: contributor.total,
      }));

    return NextResponse.json(topContributors);
  } catch (error) {
    console.error("Error fetching top contributors:", error);
    return NextResponse.json(
      { error: "Failed to fetch top contributors" },
      { status: 500 }
    );
  }
}
