"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import { Globe, Download, Upload, Trash2, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { exportProgress, importProgress, resetProgress } = useProgress();
  const [language, setLanguage] = useState<"en" | "jp">("en");
  const [importText, setImportText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      resetProgress();
      alert("Progress has been reset.");
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("light");
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Settings" />
      
      <main className="container mx-auto p-4 lg:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language / 言語
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Choose your preferred language for the interface.
              </p>
              <div className="flex gap-2">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => setLanguage("en")}
                >
                  English
                </Button>
                <Button
                  variant={language === "jp" ? "default" : "outline"}
                  onClick={() => setLanguage("jp")}
                >
                  日本語
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Theme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Toggle between light and dark mode.
              </p>
              <Button onClick={toggleTheme}>
                {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Download your learning progress as a JSON file for backup or transfer to another device.
              </p>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Progress
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Restore your progress from a previously exported JSON file.
              </p>
              <textarea
                className="mb-4 h-32 w-full rounded-md border border-input bg-transparent p-3 text-sm font-mono"
                placeholder='Paste your JSON backup here...'
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <Button onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import Progress
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-600/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Reset all your learning progress, badges, and quiz scores. This action cannot be undone.
              </p>
              <Button variant="destructive" onClick={handleReset}>
                <Trash2 className="mr-2 h-4 w-4" />
                Reset All Progress
              </Button>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About Embedded Study Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Version: 1.0.0<br />
                Built with Next.js 14, TypeScript, and Tailwind CSS<br />
                Designed for HORIBA internship preparation 🇯🇵
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
