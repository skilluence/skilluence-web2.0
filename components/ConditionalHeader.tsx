"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/Header/Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <SiteHeader />;
}
