import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { env } from "@/env";
import { Suspense } from "react";
import Loader from "@/components/loader";
import GitHubCalendar from "react-github-calendar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { Link2 } from "lucide-react";

dayjs.extend(relativeTime);

async function getUserData(username: string) {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/user/${username}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const { user, events } = await getUserData(params.username);

  return (
    <Suspense fallback={<Loader />}>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar_url} alt={user?.login} />
                <AvatarFallback>{user?.login[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user?.name || user?.login}</CardTitle>
                <p className="text-sm text-gray-500">{user?.bio}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <GitHubCalendar username={user?.login} />
            <h2 className="text-xl font-semibold mb-4">Recent Commits</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repository</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* @ts-expect-error : event type is not defined */}
                {events?.map((event) => (
                  <TableRow key={event?.id}>
                    <TableCell>
                      <Link
                        href={event?.repo?.url?.replace(
                          "https://api.github.com/repos/",
                          "https://github.com/"
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        {event?.repo?.name}
                        <Link2 className="h-3 w-3 ml-1" />
                      </Link>
                    </TableCell>
                    <TableCell>{event?.payload?.commits[0]?.message}</TableCell>
                    <TableCell>{dayjs(event?.created_at).fromNow()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
