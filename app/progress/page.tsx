"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent, ProgressBar, Button } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import { Trophy, BookOpen, CheckCircle2, Download, Upload, Trash2 } from "lucide-react";

export default function ProgressPage() {
  const { progress, isLoaded, exportProgress, importProgress, resetProgress } = useProgress();
  const [importText, setImportText] = useState("");

  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-progress-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importText) {
      const success = importProgress(importText);
      if (success) {
        setImportText("");
        alert("Progress imported successfully!");
      } else {
        alert("Failed to import progress. Please check the JSON format.");
      }
    }
  };

  const badges = [
    { name: "CAN Beginner", icon: "📡", description: "Completed CAN Bus basics" },
    { name: "SPI Beginner", icon: "🔌", description: "Completed SPI basics" },
    { name: "FreeRTOS Beginner", icon: "🧠", description: "Completed FreeRTOS basics" },
    { name: "Quiz Master", icon: "🏆", description: "Scored 100% on any quiz" },
    { name: "Dedicated Learner", icon: "⏰", description: "Studied 5+ topics" },
  ];

  return (
    <div className="min-h-screen">
      <Header title="Learning Progress" />
      
      <main className="container mx-auto p-4 lg:p-8">
        {!isLoaded ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-8">
            {/* Overall Stats */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="h-4 w-4" />
                    Topics Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{progress.completedTopics.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{progress.inProgressTopics.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Trophy className="h-4 w-4" />
                    Badges Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{progress.badges.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    📊
                    Quiz Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {Object.keys(progress.quizScores).length > 0
                      ? Math.round(
                          Object.values(progress.quizScores).reduce((a, b) => a + b, 0) /
                            Object.values(progress.quizScores).length
                        )
                      : 0}%
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Progress Bar */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressBar value={progress.completedTopics.length * 10} max={100} className="h-4" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {progress.completedTopics.length * 10}% of your learning journey completed
                </p>
              </CardContent>
            </Card>

            {/* Badges */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">🏅 Your Badges</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => {
                  const earned = progress.badges.includes(badge.name);
                  return (
                    <Card key={badge.name} className={!earned ? "opacity-50" : ""}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{earned ? badge.icon : "🔒"}</div>
                          <div>
                            <p className="font-semibold">{badge.name}</p>
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Data Management */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">💾 Data Management</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Export Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Download your progress as a JSON file for backup or transfer.
                    </p>
                    <Button onClick={handleExport}>Export Data</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Import Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Restore progress from a previously exported JSON file.
                    </p>
                    <textarea
                      className="mb-4 h-32 w-full rounded-md border border-input bg-transparent p-3 text-sm"
                      placeholder='Paste JSON data here...'
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleImport}>Import Data</Button>
                      <Button variant="destructive" onClick={resetProgress}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Reset All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
