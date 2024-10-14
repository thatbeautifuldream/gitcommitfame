import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;

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
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
