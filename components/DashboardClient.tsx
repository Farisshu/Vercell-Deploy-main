"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, BookOpenCheck, Clock, Filter, Search, Trophy } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, ProgressBar } from "@/components/ui";
import type { ContentFile } from "@/lib/content";
import { useProgress } from "@/lib/progress";

const categories = [
  { name: "Industrial Protocols", jp: "産業プロトコル", icon: "📡", color: "border-can/40 bg-can/10 text-can", slug: "protocols" },
  { name: "RTOS & Multitasking", jp: "RTOSとマルチタスク", icon: "🧠", color: "border-rtos/40 bg-rtos/10 text-rtos", slug: "rtos" },
  { name: "Toolchain", jp: "ツールチェーン", icon: "🔧", color: "border-spi/40 bg-spi/10 text-spi", slug: "toolchain" },
  { name: "Japanese Terms", jp: "日本語技術用語", icon: "🇯🇵", color: "border-japanese/40 bg-japanese/10 text-japanese", slug: "japanese" },
];

const statusStyles: Record<string, string> = {
  Completed: "bg-green-500/15 text-green-300 border-green-500/50",
  "In Progress": "bg-yellow-500/15 text-yellow-300 border-yellow-500/50",
  "Not Started": "bg-red-500/15 text-red-300 border-red-500/50",
};

interface DashboardClientProps {
  allContent: ContentFile[];
}

export default function DashboardClient({ allContent }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [language, setLanguage] = useState<"en" | "jp">("en");
  const { progress, isLoaded, getTopicStatus, markInProgress } = useProgress(allContent.length);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("embedded-study-language");
    if (savedLanguage === "en" || savedLanguage === "jp") {
      setLanguage(savedLanguage);
    }
  }, []);

  const saveLanguage = (nextLanguage: "en" | "jp") => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("embedded-study-language", nextLanguage);
  };

  const completedCount = isLoaded ? progress.completedTopics.length : 0;
  const inProgressCount = isLoaded ? progress.inProgressTopics.length : 0;
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
        const matchesCategory = categoryFilter === "all" || topic.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesLevel && matchesCategory;
      });
  }, [allContent, categoryFilter, getTopicStatus, isLoaded, levelFilter, searchQuery, statusFilter]);

  return (
    <main className="app-content">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-card/75 p-6 shadow-2xl shadow-black/30 backdrop-blur lg:p-10">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-can/20 blur-3xl" />
          <div className="absolute bottom-0 right-40 h-72 w-72 rounded-full bg-spi/10 blur-3xl" />

          <div className="relative mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-can">HORIBA Kyoto prep</p>
              <h1 className="mb-4 max-w-4xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Embedded Study Hub <span className="inline-block">🎯</span>
              </h1>
              <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Belajar CAN, SPI, FreeRTOS, toolchain, dan Japanese technical vocabulary dengan materi interaktif, quiz, checklist, dan progress lokal.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-self-start lg:justify-self-end">
              <Link href="/tests" className="inline-flex items-center gap-2 rounded-full bg-can px-4 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-can/20 transition hover:-translate-y-0.5">
                <BookOpenCheck className="h-4 w-4" /> Test Center
              </Link>
              <div className="rounded-full border border-white/10 bg-black/30 p-1 shadow-inner">
              <button className={`rounded-full px-4 py-2 text-sm transition ${language === "en" ? "bg-white text-slate-950" : "text-slate-300 hover:text-foreground"}`} onClick={() => saveLanguage("en")}>EN</button>
              <button className={`rounded-full px-4 py-2 text-sm transition ${language === "jp" ? "bg-white text-slate-950" : "text-slate-300 hover:text-foreground"}`} onClick={() => saveLanguage("jp")}>JP</button>
              </div>
            </div>
          </div>

          <div className="relative mb-6 grid gap-3 lg:grid-cols-[1fr_12rem_12rem]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search title, content, or tags..." className="h-11 bg-black/20 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <select className="h-11 rounded-md border border-input bg-black/20 px-3 py-2 text-sm text-foreground" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
              <option value="all">All status</option>
              <option value="Not Started">🔴 Not Started</option>
              <option value="In Progress">🟡 In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
            <select className="h-11 rounded-md border border-input bg-black/20 px-3 py-2 text-sm text-foreground" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} aria-label="Filter by level">
              <option value="all">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={<BookOpen className="h-7 w-7" />} label="Topics" value={allContent.length.toString()} className="text-can" />
            <StatCard icon={<Clock className="h-7 w-7" />} label={`${inProgressCount} in progress`} value={`${allContent.reduce((sum, item) => sum + item.estimatedTime, 0)} min`} className="text-spi" />
            <StatCard icon={<Trophy className="h-7 w-7" />} label="Badges" value={(isLoaded ? progress.badges.length : 0).toString()} className="text-japanese" />
            <Card className="border-white/10 bg-white/[0.04] shadow-xl">
              <CardContent className="pt-6">
                <p className="mb-3 text-sm text-muted-foreground">Overall completion</p>
                <p className="mb-3 text-3xl font-black text-foreground">{overallProgress}%</p>
                <ProgressBar value={overallProgress} className="h-3" />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-2xl font-bold"><Filter className="h-5 w-5 text-can" /> Browse by Category</h2>
            {categoryFilter !== "all" && (
              <button className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" onClick={() => setCategoryFilter("all")}>Clear category filter</button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <button key={category.slug} onClick={() => setCategoryFilter(category.slug)} className="text-left">
                <Card className={`h-full border-white/10 bg-card/75 transition-all hover:-translate-y-1 hover:border-white/30 hover:shadow-xl ${categoryFilter === category.slug ? "ring-2 ring-can/60" : ""}`}>
                  <CardHeader>
                    <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl ${category.color}`}>{category.icon}</span>
                    <CardTitle>{language === "jp" ? category.jp : category.name}</CardTitle>
                    <CardDescription>{language === "jp" ? category.name : `Open ${category.name.toLowerCase()} topics`}</CardDescription>
                  </CardHeader>
                </Card>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-bold">{searchQuery || categoryFilter !== "all" ? "Filtered Topics" : "Study Topics"}</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredContent.map((topic) => (
              <Link key={topic.slug} href={`/study/${topic.slug}`} onClick={() => markInProgress(topic.slug)}>
                <Card className="group h-full border-white/10 bg-card/80 transition-all hover:-translate-y-1 hover:border-can/50 hover:shadow-2xl hover:shadow-can/10">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <Badge variant="outline" className={statusStyles[topic.effectiveStatus] ?? statusStyles["Not Started"]}>{topic.effectiveStatus}</Badge>
                      <Badge variant="secondary">{topic.level}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-can">{topic.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 pt-1"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{topic.estimatedTime} min</span><span className="capitalize">{topic.category}</span></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-5 flex flex-wrap gap-2">{topic.tags.slice(0, 4).map((tag) => <Badge key={tag} variant="outline" className="border-white/10 text-xs text-slate-300">#{tag}</Badge>)}</div>
                    <div className="flex items-center text-sm font-medium text-can">Start learning <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {filteredContent.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-muted-foreground">No topics match your filters yet.</div>}
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, className }: { icon: ReactNode; label: string; value: string; className: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-xl">
      <CardContent className="pt-6">
        <div className={className}>{icon}</div>
        <p className="mt-4 text-3xl font-black text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
