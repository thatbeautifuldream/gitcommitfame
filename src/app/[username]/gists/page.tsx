"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface GistFile {
  filename: string;
  type: string;
  language: string | null;
  raw_url: string;
  size: number;
  content?: string;
}

interface Gist {
  id: string;
  description: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  files: { [key: string]: GistFile };
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const GistContent = ({ file }: { file: GistFile }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(file.raw_url);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Error fetching gist content:", error);
        setContent("Error loading content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [file.raw_url]);

  if (loading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  return (
    <div className="max-h-[500px] overflow-auto rounded-md">
      <SyntaxHighlighter
        language={file.language?.toLowerCase() || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "0.375rem",
        }}
        showLineNumbers
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

const GistsPage = () => {
  const params = useParams();
  const [gists, setGists] = useState<Gist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGists = async () => {
      try {
        const response = await fetch(`/api/user/${params.username}/gists`);
        if (!response.ok) {
          throw new Error("Failed to fetch gists");
        }
        const data = await response.json();
        setGists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gists");
      } finally {
        setLoading(false);
      }
    };

    fetchGists();
  }, [params.username]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gists</h1>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-lg mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gists</h1>
      <div className="grid gap-6">
        {gists.map((gist) => (
          <Card key={gist.id}>
            <CardHeader>
              <CardTitle>{gist.description || "No description"}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    Created:{" "}
                    {new Date(gist.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    Updated:{" "}
                    {new Date(gist.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(gist.files).map(([filename, file]) => (
                <div key={filename} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{filename}</h3>
                    <Badge variant="secondary">
                      {file.language || "Plain Text"}
                    </Badge>
                  </div>
                  <GistContent file={file} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GistsPage;
