import Header from "@/components/Header";
import TestCenter, { type TestTopic } from "@/components/TestCenter";
import { getAllContent, getQuizBySlug } from "@/lib/content";

export default function TestsPage() {
  const topics = getAllContent().reduce<TestTopic[]>((items, topic) => {
    const quiz = getQuizBySlug(topic.slug);
    if (!quiz) return items;

    items.push({
      slug: topic.slug,
      title: topic.title,
      category: topic.category,
      level: topic.level,
      questions: quiz.questions,
    });
    return items;
  }, []);

  return (
    <div className="min-h-screen">
      <Header title="Test Center" />
      <main className="app-content">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <TestCenter topics={topics} />
        </div>
      </main>
    </div>
  );
}
