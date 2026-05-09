"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useProgress } from "@/lib/progress";

export default function CompleteTopicButton({ slug }: { slug: string }) {
  const { markComplete, getTopicStatus } = useProgress();
  const status = getTopicStatus(slug);

  return (
    <Button className="w-full" onClick={() => markComplete(slug)} disabled={status === "Completed"}>
      <CheckCircle2 className="mr-2 h-4 w-4" />
      {status === "Completed" ? "Completed" : "Mark topic complete"}
    </Button>
  );
}
