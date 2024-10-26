import Loader from "@/components/loader";
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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Book,
  Calendar,
  GitFork,
  Link2,
  Mail,
  MapPin,
  Shield,
  Twitter,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import GitHubCalendar from "react-github-calendar";

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
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar_url} alt={user?.login} />
                <AvatarFallback>{user?.login[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <CardTitle className="text-2xl mb-1">
                  {user?.name || user?.login}
                </CardTitle>
                <p className="text-sm text-gray-500 mb-2">{user?.bio}</p>
                <div className="flex space-x-4">
                  <Link
                    href={`https://github.com/${user?.login}?tab=followers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{user?.followers}</span>
                    <span className="ml-1">followers</span>
                  </Link>
                  <Link
                    href={`https://github.com/${user?.login}?tab=following`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{user?.following}</span>
                    <span className="ml-1">following</span>
                  </Link>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">User Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.location && (
                  <DetailItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Location"
                    value={user.location}
                  />
                )}
                {user.email && (
                  <DetailItem
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={user.email}
                  />
                )}
                {user.blog && (
                  <DetailItem
                    icon={<Link2 className="h-4 w-4" />}
                    label="Blog"
                    value={user.blog}
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                  />
                )}
                {user.twitter_username && (
                  <DetailItem
                    icon={<Twitter className="h-4 w-4" />}
                    label="Twitter"
                    value={`@${user.twitter_username}`}
                    href={`https://twitter.com/${user.twitter_username}`}
                  />
                )}
                <DetailItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Joined"
                  value={dayjs(user.created_at).format("MMMM D, YYYY")}
                />
                <DetailItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Last Updated"
                  value={dayjs(user.updated_at).format("MMMM D, YYYY")}
                />
                <DetailItem
                  icon={<Shield className="h-4 w-4" />}
                  label="2FA"
                  value={
                    user.two_factor_authentication ? "Enabled" : "Disabled"
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">
                Repository Statistics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBlock
                  icon={<Book className="h-4 w-4 text-gray-600" />}
                  value={user.public_repos}
                  label="Public Repos"
                  href={`https://github.com/${user.login}?tab=repositories`}
                />
                <StatBlock
                  icon={<Book className="h-4 w-4 text-gray-600" />}
                  value={user.total_private_repos}
                  label="Private Repos"
                  href={`https://github.com/${user.login}?tab=repositories`}
                />
                <StatBlock
                  icon={<GitFork className="h-4 w-4 text-gray-600" />}
                  value={user.public_gists}
                  label="Public Gists"
                  href={`https://gist.github.com/${user.login}`}
                />
                <StatBlock
                  icon={<GitFork className="h-4 w-4 text-gray-600" />}
                  value={user.private_gists}
                  label="Private Gists"
                  href={`https://gist.github.com/${user.login}`}
                />
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <GitHubCalendar
                username={user.login}
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

const DetailItem = ({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) => {
  const content = (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
      {icon}
      <div>
        <span className="text-xs text-gray-500 block">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  );

  return href ? (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:bg-gray-100 transition-colors"
    >
      {content}
    </Link>
  ) : (
    content
  );
};
