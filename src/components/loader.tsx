import { Loader as LoaderIcon } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon className="animate-spin" />
    </div>
  );
}
