"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Clock, Trophy, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Input } from "@/components/ui";
import { getAllContent } from "@/lib/content";
import { useProgress } from "@/lib/progress";

const categories = [
  { name: "Industrial Protocols", icon: "📡", color: "can", slug: "protocols" },
  { name: "RTOS & Multitasking", icon: "🧠", color: "rtos", slug: "rtos" },
  { name: "Toolchain", icon: "🔧", color: "spi", slug: "toolchain" },
  { name: "Japanese Terms", icon: "🇯🇵", color: "japanese", slug: "japanese" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { progress, isLoaded } = useProgress();

  // Get initial content data (this would be better as server component)
  const allContent = getAllContent();
  
  const filteredContent = searchQuery
    ? allContent.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allContent;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-600/20 text-green-500 border-green-600";
      case "In Progress":
        return "bg-yellow-600/20 text-yellow-500 border-yellow-600";
      default:
        return "bg-red-600/20 text-red-500 border-red-600";
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto p-4 lg:p-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="mb-4 text-3xl font-bold tracking-tight lg:text-5xl">
            Welcome to Your Embedded Study Hub 🎯
          </h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Master embedded systems: CAN, SPI, FreeRTOS, and more. Track your progress, take quizzes, and prepare for HORIBA! 🇯🇵
          </p>

          {/* Search Bar */}
          <div className="relative mb-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search topics, tags, or content..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-10 w-10 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{allContent.length}</p>
                    <p className="text-sm text-muted-foreground">Topics Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-10 w-10 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {isLoaded ? progress.completedTopics.length : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Trophy className="h-10 w-10 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">
                      {isLoaded ? progress.badges.length : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Badges Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link key={category.name} href={`/#${category.slug}`}>
                <Card className="transition-all hover:shadow-lg hover:shadow-${category.color}-500/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      {category.name}
                    </CardTitle>
                    <CardDescription>
                      Explore {category.name.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Topics */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold">
            {searchQuery ? "Search Results" : "All Topics"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((topic) => (
              <Link key={topic.slug} href={`/study/${topic.slug}`}>
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex items-start justify-between">
                      <Badge variant="outline" className={getStatusColor(topic.status)}>
                        {topic.status}
                      </Badge>
                      <Badge variant="secondary">{topic.level}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{topic.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {topic.estimatedTime} min
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {topic.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground">
                      Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
