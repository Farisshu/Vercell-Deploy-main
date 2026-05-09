"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Filter, Search, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Input, ProgressBar } from "@/components/ui";
import type { ContentFile } from "@/lib/content";
import { useProgress } from "@/lib/progress";

const categories = [
  { name: "Industrial Protocols", jp: "産業プロトコル", icon: "📡", color: "can", slug: "protocols" },
  { name: "RTOS & Multitasking", jp: "RTOSとマルチタスク", icon: "🧠", color: "rtos", slug: "rtos" },
  { name: "Toolchain", jp: "ツールチェーン", icon: "🔧", color: "spi", slug: "toolchain" },
  { name: "Japanese Terms", jp: "日本語技術用語", icon: "🇯🇵", color: "japanese", slug: "japanese" },
];

const statusStyles: Record<string, string> = {
  Completed: "bg-green-600/20 text-green-500 border-green-600",
  "In Progress": "bg-yellow-600/20 text-yellow-500 border-yellow-600",
  "Not Started": "bg-red-600/20 text-red-500 border-red-600",
};

interface DashboardClientProps {
  allContent: ContentFile[];
}

export default function DashboardClient({ allContent }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [language, setLanguage] = useState<"en" | "jp">("en");
  const { progress, isLoaded, getTopicStatus, markInProgress } = useProgress(allContent.length);

  const completedCount = isLoaded ? progress.completedTopics.length : 0;
  const overallProgress = allContent.length ? Math.round((completedCount / allContent.length) * 100) : 0;

  const filteredContent = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return allContent
      .map((topic) => ({ ...topic, effectiveStatus: isLoaded ? getTopicStatus(topic.slug) : topic.status }))
      .filter((topic) => {
        const matchesSearch = !query ||
          topic.title.toLowerCase().includes(query) ||
          topic.content.toLowerCase().includes(query) ||
          topic.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesStatus = statusFilter === "all" || topic.effectiveStatus === statusFilter;
        const matchesLevel = levelFilter === "all" || topic.level === levelFilter;
        return matchesSearch && matchesStatus && matchesLevel;
      });
  }, [allContent, getTopicStatus, isLoaded, levelFilter, searchQuery, statusFilter]);

  return (
    <main className="container mx-auto p-4 lg:p-8">
      <section className="mb-12 rounded-3xl border bg-gradient-to-br from-card via-card to-secondary/40 p-6 shadow-2xl shadow-can/5 lg:p-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-can">HORIBA Kyoto prep</p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight lg:text-5xl">
              Embedded Study Hub 🎯
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground">
              Master CAN, SPI, FreeRTOS, MISRA-C habits, and Japanese technical vocabulary with interactive notes, quizzes, checklists, and local progress tracking.
            </p>
          </div>
          <div className="flex rounded-full border bg-background p-1">
            <button className={`rounded-full px-4 py-2 text-sm ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} onClick={() => setLanguage("en")}>EN</button>
            <button className={`rounded-full px-4 py-2 text-sm ${language === "jp" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} onClick={() => setLanguage("jp")}>JP</button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search title, content, or tags..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option value="all">All status</option>
            <option value="Not Started">🔴 Not Started</option>
            <option value="In Progress">🟡 In Progress</option>
            <option value="Completed">✅ Completed</option>
          </select>
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} aria-label="Filter by level">
            <option value="all">All levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Card><CardContent className="pt-6"><BookOpen className="mb-3 h-8 w-8 text-can" /><p className="text-2xl font-bold">{allContent.length}</p><p className="text-sm text-muted-foreground">Topics</p></CardContent></Card>
          <Card><CardContent className="pt-6"><Clock className="mb-3 h-8 w-8 text-spi" /><p className="text-2xl font-bold">{allContent.reduce((sum, item) => sum + item.estimatedTime, 0)} min</p><p className="text-sm text-muted-foreground">Study time</p></CardContent></Card>
          <Card><CardContent className="pt-6"><Trophy className="mb-3 h-8 w-8 text-japanese" /><p className="text-2xl font-bold">{isLoaded ? progress.badges.length : 0}</p><p className="text-sm text-muted-foreground">Badges</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="mb-3 text-sm text-muted-foreground">Overall completion</p><p className="mb-3 text-2xl font-bold">{overallProgress}%</p><ProgressBar value={overallProgress} /></CardContent></Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold"><Filter className="h-5 w-5" /> Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <a key={category.slug} href={`#${category.slug}`}>
              <Card className="h-full transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><span className="text-2xl">{category.icon}</span>{language === "jp" ? category.jp : category.name}</CardTitle>
                  <CardDescription>{language === "jp" ? category.name : `Explore ${category.name.toLowerCase()}`}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">{searchQuery ? "Search Results" : "Study Topics"}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((topic) => (
            <Link key={topic.slug} href={`/study/${topic.slug}`} onClick={() => markInProgress(topic.slug)}>
              <Card id={topic.category} className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <Badge variant="outline" className={statusStyles[topic.effectiveStatus] ?? statusStyles["Not Started"]}>{topic.effectiveStatus}</Badge>
                    <Badge variant="secondary">{topic.level}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{topic.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{topic.estimatedTime} min</span><span className="capitalize">{topic.category}</span></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">{topic.tags.slice(0, 4).map((tag) => <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>)}</div>
                  <div className="flex items-center text-sm text-muted-foreground">Start learning <ArrowRight className="ml-2 h-4 w-4" /></div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
