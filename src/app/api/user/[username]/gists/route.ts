import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Octokit } from "@octokit/rest";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const headersList = headers();
    const token = headersList.get("authorization")?.split(" ")[1];

    if (!params.username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const octokit = new Octokit({
      auth: token,
    });

    const { data: gists } = await octokit.gists.listForUser({
      username: params.username,
      per_page: 100, // Adjust this value based on your needs
    });

    return NextResponse.json(gists);
  } catch (error: any) {
    console.error("Error fetching gists:", error);

    if (error.status === 404) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (error.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
