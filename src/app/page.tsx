"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen flex flex-col justify-between">
      <section className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight">GitCommitFame</h1>
        <p className="text-xl text-muted-foreground">
          Showcase your GitHub commits in one click
        </p>
        <div className="flex items-center justify-center space-x-4 text-lg">
          <Github className="w-6 h-6" />
          <ArrowRight className="w-6 h-6" />
          <span className="font-semibold">gitcommitfame.com</span>
        </div>
      </section>

      <section className="my-16 text-center">
        <h2 className="text-2xl font-semibold mb-6">How it works</h2>
        <ol className="space-y-4 text-lg">
          <li>1. Go to your GitHub profile</li>
          <li>2. Replace 'github' with 'gitcommitfame'</li>
          <li>3. View and share your commit history</li>
        </ol>
      </section>

      <section className="text-center">
        <Button
          size="lg"
          className="text-lg px-8"
          onClick={() => window.open("https://github.com", "_blank")}
        >
          Try It Now
        </Button>
      </section>

      <footer className="text-center text-sm text-muted-foreground mt-16">
        <p>
          &copy; {new Date().getFullYear()} &lt;GitCommitFame /&gt; by{" "}
          <a
            href="https://milindmishra.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Visit Milind Mishra's website"
          >
            Milind Mishra
          </a>
        </p>
      </footer>
    </div>
  );
}
