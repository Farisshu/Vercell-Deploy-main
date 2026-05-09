"use client";

import { Badge } from "@/components/ui";
import { useProgress } from "@/lib/progress";

const statusStyles = {
  Completed: "bg-green-500/15 text-green-300 border-green-500/50",
  "In Progress": "bg-yellow-500/15 text-yellow-300 border-yellow-500/50",
  "Not Started": "bg-red-500/15 text-red-300 border-red-500/50",
};

export default function TopicStatusBadge({ slug, fallback }: { slug: string; fallback: "Not Started" | "In Progress" | "Completed" }) {
  const { isLoaded, getTopicStatus } = useProgress();
  const status = isLoaded ? getTopicStatus(slug) : fallback;

  return <Badge variant="outline" className={statusStyles[status]}>{status}</Badge>;
}
