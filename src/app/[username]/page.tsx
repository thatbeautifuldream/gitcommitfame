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

async function getUserData(username: string) {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/user/${username}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user data");
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
                <AvatarImage src={user.avatar_url} alt={user.login} />
                <AvatarFallback>{user.login[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name || user.login}</CardTitle>
                <p className="text-sm text-gray-500">{user.bio}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.repo.name}</TableCell>
                    <TableCell>{event.payload.commits[0].message}</TableCell>
                    <TableCell>
                      {new Date(event.created_at).toLocaleDateString()}
                    </TableCell>
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
