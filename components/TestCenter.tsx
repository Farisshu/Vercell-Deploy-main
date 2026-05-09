"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, Trophy } from "lucide-react";
import QuizWidget from "@/components/QuizWidget";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, ProgressBar } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import type { QuizQuestion } from "@/lib/content";

export interface TestTopic {
  slug: string;
  title: string;
  category: string;
  level: string;
  questions: QuizQuestion[];
}

interface TestCenterProps {
  topics: TestTopic[];
}

export default function TestCenter({ topics }: TestCenterProps) {
  const [selectedSlug, setSelectedSlug] = useState(topics[0]?.slug ?? "");
  const { progress, isLoaded } = useProgress();

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.slug === selectedSlug) ?? topics[0],
    [selectedSlug, topics],
  );

  const averageScore = useMemo(() => {
    const scores = Object.values(progress.quizScores);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [progress.quizScores]);

  if (topics.length === 0) {
    return (
      <Card className="border-white/10 bg-card/80">
        <CardContent className="p-8 text-center text-muted-foreground">No quizzes are available yet.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <aside className="space-y-4">
        <Card className="border-white/10 bg-card/80 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-japanese" />
              Test Progress
            </CardTitle>
            <CardDescription>Nilai tersimpan otomatis di browser.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-end justify-between gap-3">
              <span className="text-sm text-muted-foreground">Quiz average</span>
              <span className="text-3xl font-black">{isLoaded ? averageScore : 0}%</span>
            </div>
            <ProgressBar value={isLoaded ? averageScore : 0} className="h-3" />
          </CardContent>
        </Card>

        <div className="space-y-3">
          {topics.map((topic) => {
            const score = progress.quizScores[topic.slug];
            const selected = topic.slug === selectedTopic.slug;
            return (
              <button
                key={topic.slug}
                type="button"
                onClick={() => setSelectedSlug(topic.slug)}
                className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-can/60 ${
                  selected ? "border-can/70 bg-can/10 shadow-lg shadow-can/10" : "border-white/10 bg-card/70"
                }`}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="font-bold">{topic.title}</div>
                  {typeof score === "number" && <Badge variant="outline">{score}%</Badge>}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="capitalize">{topic.category}</span>
                  <span>•</span>
                  <span>{topic.questions.length} questions</span>
                  <span>•</span>
                  <span>{topic.level}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-5 rounded-3xl border border-white/10 bg-card/80 p-6 shadow-xl">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <BookOpenCheck className="h-7 w-7 text-can" />
            <h1 className="text-3xl font-black">{selectedTopic.title} Test</h1>
            <Badge variant="secondary">{selectedTopic.questions.length} questions</Badge>
          </div>
          <p className="text-muted-foreground">
            Kerjakan test ini untuk cek pemahaman. Skor terbaik akan masuk ke halaman Progress.
          </p>
        </div>

        <QuizWidget key={selectedTopic.slug} slug={selectedTopic.slug} questions={selectedTopic.questions} />
      </section>
    </div>
  );
}
