"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";

type QuizQuestion = {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: string;
};

type QuizResults = {
  quizData: QuizQuestion[];
  userAnswers: string[];
};

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  useEffect(() => {
    const resultsParam = searchParams.get("results");
    if (resultsParam) {
      try {
        const parsedResults = JSON.parse(
          decodeURIComponent(resultsParam),
        ) as QuizResults;
        setQuizResults(parsedResults);
      } catch (error) {
        console.error("Error parsing quiz results:", error);
      }
    }
  }, [searchParams]);

  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
    );
  };

  const calculateScore = () => {
    if (!quizResults) return "0/0";
    const correctAnswers = quizResults.quizData.filter(
      (q, index) => q.correctAnswer === quizResults.userAnswers[index],
    );
    return `${correctAnswers.length}/${quizResults.quizData.length}`;
  };

  if (!quizResults) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          <h1 className="mb-6 text-center text-3xl font-bold">Quiz Review</h1>
          <div className="mb-6 text-center text-xl font-semibold">
            Your Score: {calculateScore()}
          </div>
          <ScrollArea className="h-[60vh] pr-4">
            {quizResults.quizData.map((question, qIndex) => (
              <Card key={question.id} className="mb-4">
                <CardContent className="p-4">
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() => toggleQuestion(question.id)}
                  >
                    <h2 className="text-xl font-semibold">
                      Question {qIndex + 1}: {question.question}
                    </h2>
                    <Button variant="ghost">
                      {expandedQuestions.includes(question.id)
                        ? "Hide"
                        : "Show"}{" "}
                      Answers
                    </Button>
                  </div>
                  {expandedQuestions.includes(question.id) && (
                    <div className="mt-4">
                      {question.answers.map((answer, aIndex) => (
                        <div
                          key={aIndex}
                          className={`mb-2 flex items-center rounded-md p-2 ${
                            answer === quizResults.userAnswers[qIndex] &&
                            answer === question.correctAnswer
                              ? "bg-green-100"
                              : answer === quizResults.userAnswers[qIndex]
                                ? "bg-red-100"
                                : answer === question.correctAnswer
                                  ? "border border-green-500"
                                  : ""
                          }`}
                        >
                          {answer === quizResults.userAnswers[qIndex] &&
                          answer === question.correctAnswer ? (
                            <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
                          ) : answer === quizResults.userAnswers[qIndex] ? (
                            <XCircle className="mr-2 h-6 w-6 text-red-500" />
                          ) : answer === question.correctAnswer ? (
                            <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />
                          ) : (
                            <div className="mr-2 h-6 w-6 rounded-full border-2 border-gray-300" />
                          )}
                          <span>{answer}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          <div className="mt-6 text-center">
            {/* <Button onClick={() => (window.location.href = "/")}> */}
            <Button onClick={() => console.log("Retake Quiz clicked")}>
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
