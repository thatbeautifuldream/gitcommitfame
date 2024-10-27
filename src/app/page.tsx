"use client";

import { Button } from "@/components/ui/button";
import { instrumentSerif } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";

export default function Home() {
  const [showAnnotations, setShowAnnotations] = useState(false);

  // TODO : fix random layout shift from the rough notation library
  useEffect(() => {
    const timer = setTimeout(() => setShowAnnotations(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen flex flex-col justify-between">
      <section className="flex flex-col items-center gap-6 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-normal text-center leading-tight",
            instrumentSerif.className
          )}
        >
          <span className="text-gray-900">The Developer's Showcase</span>
          <br />
          <span className="text-gray-700">
            to{" "}
            <RoughNotationGroup show={showAnnotations}>
              <RoughNotation type="highlight" color="#34D399" order={1}>
                <span className="italic">highlight</span>
              </RoughNotation>{" "}
              &amp;{" "}
              <RoughNotation
                type="underline"
                color="#000000"
                order={2}
                padding={0.2}
              >
                share
              </RoughNotation>
            </RoughNotationGroup>{" "}
            your GitHub journey!
          </span>
        </h1>
        <h2 className="text-gray-600 text-base sm:text-lg text-center max-w-2xl">
          {[
            "Showcase your commits",
            "visualize your progress",
            "impress recruiters",
          ].map((text, index) => (
            <React.Fragment key={index}>
              <button
                className="text-gray-600 hover:text-green-700 font-normal transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 rounded"
                type="button"
              >
                {text}
              </button>
              {index < 2 && <span className="mx-1">,</span>}
              {index === 2 && <span className="mx-1">and</span>}
            </React.Fragment>
          ))}
          <span>connect with the most innovative developers.</span>
        </h2>
        <div className="flex items-center justify-center space-x-4 text-base sm:text-lg mt-2">
          <Github className="w-5 h-5 sm:w-6 sm:h-6" />
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
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
          <Link
            href="/thatbeautifuldream"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Take a look at Milind's Commit History"
          >
            Milind Mishra
          </Link>
        </p>
      </footer>
    </div>
  );
}
