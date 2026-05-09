"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizWidgetProps {
  slug: string;
  questions: Question[];
  onQuizComplete: (score: number) => void;
}

export default function QuizWidget({ slug, questions, onQuizComplete }: QuizWidgetProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || answered) return;

    setAnswered(true);
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Quiz completed
      const finalScore = score;
      setQuizCompleted(true);
      onQuizComplete(finalScore);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswered(false);
    setQuizCompleted(false);
    setShowResult(false);
  };

  if (questions.length === 0) {
    return null;
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <h3 className="mb-4 text-2xl font-bold">Quiz Completed! 🎉</h3>
        <div className="mb-4 text-4xl">
          {percentage >= 80 ? "🏆" : percentage >= 60 ? "👍" : "📚"}
        </div>
        <p className="mb-2 text-lg">
          Your Score: <span className="font-bold">{score}/{questions.length}</span> ({percentage}%)
        </p>
        <p className="mb-4 text-muted-foreground">
          {percentage >= 80 
            ? "Excellent! You've mastered this topic!" 
            : percentage >= 60 
            ? "Good job! Keep practicing!" 
            : "Keep studying and try again!"}
        </p>
        <Button onClick={handleRestart} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Quiz: Question {currentQuestion + 1}/{questions.length}
        </h3>
        <span className="text-sm text-muted-foreground">
          Score: {score}
        </span>
      </div>

      <p className="mb-6 text-lg">{question.question}</p>

      <div className="mb-6 space-y-3">
        {question.options.map((option, index) => {
          let buttonStyle = "w-full justify-start text-left";
          
          if (answered) {
            if (index === question.correct) {
              buttonStyle += " bg-green-600/20 border-green-600";
            } else if (index === selectedAnswer && index !== question.correct) {
              buttonStyle += " bg-red-600/20 border-red-600";
            }
          } else if (selectedAnswer === index) {
            buttonStyle += " bg-primary/20 border-primary";
          }

          return (
            <Button
              key={index}
              variant="outline"
              className={buttonStyle}
              onClick={() => handleSelectAnswer(index)}
              disabled={answered}
            >
              {answered && index === question.correct && (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              )}
              {answered && index === selectedAnswer && index !== question.correct && (
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
              )}
              {!answered && selectedAnswer !== index && (
                <HelpCircle className="mr-2 h-4 w-4" />
              )}
              {option}
            </Button>
          );
        })}
      </div>

      {answered && (
        <div className="mb-6 rounded-md bg-secondary p-4">
          <p className="font-semibold">
            {selectedAnswer === question.correct ? "✅ Correct!" : "❌ Incorrect"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!answered ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        )}
      </div>
    </div>
  );
}
