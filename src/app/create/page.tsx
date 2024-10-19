"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export default function CreateQuizPage() {
  const router = useRouter();
  const pathname = useSearchParams();

  const [prompt, setPrompt] = useState("");
  const [time, setTime] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (pathname.get("prompt")) {
      setPrompt(pathname.get("prompt") ?? "");
    }

    if (pathname.get("time")) {
      setTime(pathname.get("time") ?? "");
    }

    if (pathname.get("question")) {
      setQuestion(pathname.get("question") ?? "");
    }
  }, [pathname]);

  function handleCreateQuiz() {
    router.push(`/quiz/1`);
  }

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
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            id="number-of-questions"
          />

          <Button onClick={handleCreateQuiz} className="rounded-md p-2">
            Create Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
