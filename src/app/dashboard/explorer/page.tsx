import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ExplorerContent } from "./_client";

export const metadata: Metadata = {
  title: "Search Explorer | AACSearch",
  description: "Explore, search, and inspect your indexed data",
};

export default async function ExplorerPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return <ExplorerContent />;
}
