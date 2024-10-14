import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { env } from "@/env";

type TopContributor = {
  username: string | undefined;
  avatarUrl: string | undefined;
  commits: number;
}[];

async function getTopContributors(): Promise<TopContributor> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/top-contributors`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch top contributors");
  return res.json();
}

export async function Leaderboard() {
  const contributors = await getTopContributors();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Commits</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contributors.map((contributor, index) => (
          <TableRow key={contributor.username}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <Link
                href={`/${contributor.username}`}
                className="flex items-center space-x-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={contributor.avatarUrl}
                    alt={contributor.username}
                  />
                  <AvatarFallback>
                    {contributor?.username ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span>{contributor.username}</span>
              </Link>
            </TableCell>
            <TableCell>{contributor.commits}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
