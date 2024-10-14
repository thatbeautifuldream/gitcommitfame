import { Suspense } from "react";
import { Leaderboard } from "@/components/leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading leaderboard...</div>}>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>GitHub Commit Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Leaderboard />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
