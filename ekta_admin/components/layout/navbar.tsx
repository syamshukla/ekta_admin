"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DotIcon, RocketIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="flex items-center justify-between px-3 py-3"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <Link href="/" className="flex items-center">
            <span className="overflow-auto font-semibold leading-tight tracking-tight">
              EKTA Admin
            </span>
            <Badge variant="secondary" className="rounded-sm ml-2">
              Beta
            </Badge>
          </Link>
        </div>
        <ModeToggle />
      </nav>
    </header>
  );
}
