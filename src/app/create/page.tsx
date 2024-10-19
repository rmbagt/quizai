"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "~/trpc/react";

interface QuizQuestion {
  question: string;
  choices: string[];
  answer: number;
}

interface QuizData {
  theme: string;
  questions: QuizQuestion[];
}

export default function CreateQuizPage() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync, isPending } = api.completions.generateQuiz.useMutation();

  const [prompt, setPrompt] = useState("");
  const [time, setTime] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [quizData, setQuizData] = useState<QuizData>({
    theme: "",
    questions: [],
  });

  useEffect(() => {
    setPrompt(searchParams.get("prompt") ?? "");
    setTime(searchParams.get("time") ?? "");
    setQuestionCount(searchParams.get("question") ?? "");
  }, [searchParams]);

  const handleCreateQuiz = async () => {
    const res = await mutateAsync({
      topic: prompt,
      totalQuestions: Number(questionCount),
    });

    setQuizData(res.object);
  };

  return (
    <div className="flex min-h-screen flex-col px-10 py-14 md:px-32">
      <div className="rounded-md border-2 p-4 shadow-sm">
        <h1 className="text-lg font-bold">Create a New Quiz</h1>
        <div className="mt-4 flex flex-col gap-4">
          <label
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="prompt"
          >
            Tell me about your quiz
          </label>
          <Textarea
            placeholder="Calculus quiz that covers derivatives and integrals"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            id="prompt"
          />
          <label
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="time"
          >
            Time (in minutes)
          </label>
          <Input
            placeholder="30"
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            id="time"
          />
          <label
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="number-of-questions"
          >
            Number of Questions
          </label>
          <Input
            placeholder="20"
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            id="number-of-questions"
          />

          <Button
            onClick={handleCreateQuiz}
            className="rounded-md p-2"
            disabled={isPending}
          >
            {isPending ? "Generating..." : "Create Quiz"}
          </Button>
        </div>
      </div>

      {quizData && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Generated Quiz</h2>
          <pre className="mt-4 whitespace-pre-wrap">
            {JSON.stringify(quizData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
