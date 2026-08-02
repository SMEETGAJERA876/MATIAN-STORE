"use client";

import { use } from "react";
import { MainLayout } from "@/adminApp/App";

export default function AdminModulePage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = use(params);
  const initialModule = resolvedParams.slug?.[0] || "dashboard";

  return <MainLayout initialModule={initialModule} />;
}
