import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/content";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import QuizWidget from "@/components/QuizWidget";
import Checklist from "@/components/Checklist";
import Header from "@/components/Header";
import { Badge } from "@/components/ui";

interface StudyPageProps {
  params: { slug: string[] };
}

export default async function StudyPage({ params }: StudyPageProps) {
  const slug = params.slug.join("/");
  const content = getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  // Try to load quiz data
  let quizData = null;
  try {
    const quizModule = await import(`@/content/${slug}/quiz.json`);
    quizData = quizModule.default;
  } catch (e) {
    // No quiz available for this topic
  }

  // Example checklist items (can be customized per topic)
  const checklistItems = [
    { id: "1", text: "I understand the basic concepts" },
    { id: "2", text: "I can explain this to someone else" },
    { id: "3", text: "I've completed the quiz with 80%+ score" },
    { id: "4", text: "I've practiced with real code/examples" },
  ];

  const getStatusColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-600/20 text-green-500 border-green-600";
      case "Intermediate":
        return "bg-yellow-600/20 text-yellow-500 border-yellow-600";
      case "Advanced":
        return "bg-red-600/20 text-red-500 border-red-600";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="min-h-screen">
      <Header title={content.title} />
      
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Metadata */}
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge variant="outline" className={getStatusColor(content.level)}>
                {content.level}
              </Badge>
              <Badge variant="outline">⏱️ {content.estimatedTime} min</Badge>
              {content.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Content */}
            <article className="prose prose-invert max-w-none">
              <MarkdownRenderer content={content.content} />
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">📊 Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline">{content.status}</Badge>
                </div>
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">{content.category}</p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <Checklist slug={slug} items={checklistItems} />

            {/* Quiz */}
            {quizData && (
              <QuizWidget
                slug={slug}
                questions={quizData.questions}
                onQuizComplete={(score) => {
                  console.log("Quiz completed with score:", score);
                  // Score will be saved via useProgress hook
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
