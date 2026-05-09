"use client";

import { useEffect, useState } from "react";

export interface StudyProgress {
  completedTopics: string[];
  inProgressTopics: string[];
  quizScores: Record<string, number>;
  checklists: Record<string, boolean[]>;
  lastStudied: Record<string, string>;
  badges: string[];
}

const defaultProgress: StudyProgress = {
  completedTopics: [],
  inProgressTopics: [],
  quizScores: {},
  checklists: {},
  lastStudied: {},
  badges: [],
};

const STORAGE_KEY = "embedded-study-progress";

export function useProgress() {
  const [progress, setProgress] = useState<StudyProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setProgress(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load progress:", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const saveProgress = (newProgress: StudyProgress) => {
    setProgress(newProgress);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    }
  };

  const markComplete = (slug: string) => {
    const newProgress = { ...progress };
    newProgress.completedTopics = [...new Set([...newProgress.completedTopics, slug])];
    newProgress.inProgressTopics = newProgress.inProgressTopics.filter((s) => s !== slug);
    newProgress.lastStudied[slug] = new Date().toISOString();
    
    // Check for badges
    const categoryBadges: Record<string, { count: number; badge: string }> = {
      "protocols/can": { count: 1, badge: "CAN Beginner" },
      "protocols/spi": { count: 1, badge: "SPI Beginner" },
      "rtos/freertos": { count: 1, badge: "FreeRTOS Beginner" },
    };

    for (const [prefix, { count, badge }] of Object.entries(categoryBadges)) {
      const matchingTopics = newProgress.completedTopics.filter((s) => s.startsWith(prefix));
      if (matchingTopics.length >= count && !newProgress.badges.includes(badge)) {
        newProgress.badges = [...newProgress.badges, badge];
      }
    }

    saveProgress(newProgress);
  };

  const markInProgress = (slug: string) => {
    if (!progress.completedTopics.includes(slug)) {
      const newProgress = {
        ...progress,
        inProgressTopics: [...new Set([...newProgress.inProgressTopics, slug])],
        lastStudied: { ...progress.lastStudied, [slug]: new Date().toISOString() },
      };
      saveProgress(newProgress);
    }
  };

  const saveQuizScore = (slug: string, score: number) => {
    const newProgress = {
      ...progress,
      quizScores: { ...progress.quizScores, [slug]: Math.max(score, progress.quizScores[slug] || 0) },
    };
    saveProgress(newProgress);
  };

  const saveChecklist = (slug: string, items: boolean[]) => {
    const newProgress = {
      ...progress,
      checklists: { ...progress.checklists, [slug]: items },
    };
    saveProgress(newProgress);
  };

  const getTopicStatus = (slug: string): "Not Started" | "In Progress" | "Completed" => {
    if (progress.completedTopics.includes(slug)) return "Completed";
    if (progress.inProgressTopics.includes(slug)) return "In Progress";
    return "Not Started";
  };

  const getOverallProgress = (): number => {
    // This will be calculated dynamically based on total topics
    const totalTopics = 3; // Will be updated based on actual content
    if (totalTopics === 0) return 0;
    return Math.round((progress.completedTopics.length / totalTopics) * 100);
  };

  const exportProgress = (): string => {
    return JSON.stringify(progress, null, 2);
  };

  const importProgress = (jsonString: string): boolean => {
    try {
      const imported = JSON.parse(jsonString);
      saveProgress(imported);
      return true;
    } catch (e) {
      console.error("Failed to import progress:", e);
      return false;
    }
  };

  const resetProgress = () => {
    saveProgress(defaultProgress);
  };

  return {
    progress,
    isLoaded,
    markComplete,
    markInProgress,
    saveQuizScore,
    saveChecklist,
    getTopicStatus,
    getOverallProgress,
    exportProgress,
    importProgress,
    resetProgress,
  };
}
