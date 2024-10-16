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
import { Book, GitFork, Link2, Users } from "lucide-react";

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
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatar_url} alt={user?.login} />
                <AvatarFallback>{user?.login[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {user?.name || user?.login}
                </CardTitle>
                <p className="text-sm text-gray-500">{user?.bio}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatBlock
                icon={<Users className="h-4 w-4 text-gray-600" />}
                value={user?.followers}
                label="Followers"
                href={`https://github.com/${user?.login}?tab=followers`}
              />
              <StatBlock
                icon={<Users className="h-4 w-4 text-gray-600" />}
                value={user?.following}
                label="Following"
                href={`https://github.com/${user?.login}?tab=following`}
              />
              <StatBlock
                icon={<Book className="h-4 w-4 text-gray-600" />}
                value={user?.public_repos}
                label="Repos"
                href={`https://github.com/${user?.login}?tab=repositories`}
              />
              <StatBlock
                icon={<GitFork className="h-4 w-4 text-gray-600" />}
                value={user?.public_gists}
                label="Gists"
                href={`https://gist.github.com/${user?.login}`}
              />
            </div>
            <div className="flex justify-center mb-6">
              <GitHubCalendar
                username={user?.login}
                colorScheme="light"
                fontSize={10}
                blockSize={8}
              />
            </div>
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-3">Recent Commits</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Repository</TableHead>
                      <TableHead className="w-1/2">Message</TableHead>
                      <TableHead className="w-1/6">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* @ts-expect-error : event type is not defined */}
                    {events?.map((event) => (
                      <TableRow key={event?.id}>
                        <TableCell className="py-2">
                          <Link
                            href={event?.repo?.url?.replace(
                              "https://api.github.com/repos/",
                              "https://github.com/"
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm hover:underline"
                          >
                            {event?.repo?.name}
                            <Link2 className="h-3 w-3 ml-1" />
                          </Link>
                        </TableCell>
                        <TableCell className="py-2 text-sm">
                          {event?.payload?.commits[0]?.message}
                        </TableCell>
                        <TableCell className="py-2 text-sm">
                          {dayjs(event?.created_at).fromNow()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}

const StatBlock = ({
  icon,
  value,
  label,
  href,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  href: string;
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
  >
    {icon}
    <div>
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs text-gray-500 block">{label}</span>
    </div>
  </Link>
);
