import { env } from "@/env";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

// Helper function to validate GitHub username
const isValidGitHubUsername = (username: string): boolean => {
  const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return githubUsernameRegex.test(username);
};

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = decodeURIComponent(params.username);

  if (!isValidGitHubUsername(username)) {
    return NextResponse.json(
      { error: "Invalid GitHub username" },
      { status: 400 }
    );
  }

  try {
    const [userResponse, eventsResponse] = await Promise.all([
      octokit.users.getByUsername({ username }),
      octokit.activity.listPublicEventsForUser({ username }),
    ]);

    const user = userResponse.data;
    const events = eventsResponse.data
      .filter((event) => event.type === "PushEvent")
      .slice(0, 10);

    return NextResponse.json({ user, events });
  } catch (error) {
    console.error(`Error fetching user data for ${username}:`, error);

    if (error instanceof Error) {
      if (error.message === "Not Found") {
        return NextResponse.json(
          { error: "GitHub user not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch user data", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
