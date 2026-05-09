"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui";
import { useProgress } from "@/lib/progress";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistProps {
  slug: string;
  items: ChecklistItem[];
}

export default function Checklist({ slug, items }: ChecklistProps) {
  const { progress, saveChecklist } = useProgress();
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );

  useEffect(() => {
    if (progress.checklists[slug]) {
      setCheckedItems(progress.checklists[slug]);
    }
  }, [progress.checklists, slug]);

  const toggleItem = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    saveChecklist(slug, newCheckedItems);
  };

  const allChecked = checkedItems.every((item) => item);
  const progressPercentage = Math.round(
    (checkedItems.filter((item) => item).length / items.length) * 100
  );

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">✅ Learning Checklist</h3>
        <span className="text-sm text-muted-foreground">{progressPercentage}% Complete</span>
      </div>

      <div className="mb-4 space-y-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => toggleItem(index)}
            className="flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors hover:bg-secondary"
          >
            {checkedItems[index] ? (
              <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
            ) : (
              <Square className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <span
              className={checkedItems[index] ? "text-muted-foreground line-through" : ""}
            >
              {item.text}
            </span>
          </button>
        ))}
      </div>

      {allChecked && (
        <div className="rounded-md bg-green-600/20 p-3 text-center text-green-500">
          🎉 All items completed! Great job!
        </div>
      )}
    </div>
  );
}
