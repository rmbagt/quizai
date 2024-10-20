"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "~/trpc/react";
import type { QuizData, QuizQuestion } from "~/types/quiz";
import { QuizDisplay } from "~/components/create/quiz-display";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const utils = api.useUtils();

  const { mutateAsync, isPending } = api.completions.generateQuiz.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      toast.success("Quiz generated successfully");
    },
    onMutate: () => {
      toast.info("Generating quiz...");
    },
  });
  const { mutateAsync: createQuiz } = api.quiz.createQuiz.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      toast.success("Quiz created successfully");
      router.push("/app/quiz");
      router.refresh();
    },
    onMutate: async () => {
      toast.info("Creating quiz...");
    },
  });

  const [prompt, setPrompt] = useState("");
  const [time, setTime] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [language, setLanguage] = useState("");
  const [quizData, setQuizData] = useState<QuizData>({
    theme: "",
    questions: [],
    workingTime: Number(time),
    language: language,
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
      language: language,
    });

    setQuizData({
      ...res.object,
      workingTime: Number(time),
      language: language,
    });
  };

  const handleQuestionChange = (index: number, newQuestion: string) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[index]) {
      updatedQuestions[index].question = newQuestion;
    }
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    newChoice: string,
  ) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[questionIndex]) {
      updatedQuestions[questionIndex].choices[choiceIndex] = newChoice;
    }
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleAnswerChange = (questionIndex: number, newAnswer: number) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[questionIndex]) {
      updatedQuestions[questionIndex].answer = newAnswer;
    }
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addNewQuestion = () => {
    const newQuestion: QuizQuestion = {
      question: "",
      choices: ["", "", "", ""],
      answer: 0,
    };
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion],
    });
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: updatedQuestions });
    toast.success("Question deleted successfully");
  };

  const handleSubmitQuiz = async () => {
    console.log("Submitting quiz:", quizData);
    await createQuiz(quizData);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-10 py-14 md:px-24">
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
        What do you want to practice?
      </h1>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="relative">
              <Textarea
                placeholder="Tell me about your quiz..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col justify-between gap-1">
                <Label htmlFor="time">Time (in minutes)</Label>
                <Input
                  placeholder="Ex: 30"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  id="time"
                />
              </div>
              <div className="flex flex-col justify-between gap-1">
                <Label htmlFor="number-of-questions">Number of Questions</Label>
                <Input
                  placeholder="Ex: 20"
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                  id="number-of-questions"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="language">Language</Label>
              <Input
                placeholder="Ex: English"
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                id="language"
              />
            </div>
            <Button onClick={handleCreateQuiz} disabled={isPending}>
              {isPending ? "Generating..." : "Create Quiz"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {quizData.questions.length > 0 && (
        <div className="mt-8 w-full max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold">Edit Quiz Questions</h2>
          {quizData.questions.map((question, questionIndex) => (
            <QuizDisplay
              key={questionIndex}
              question={question}
              questionIndex={questionIndex}
              handleQuestionChange={handleQuestionChange}
              handleAnswerChange={handleAnswerChange}
              handleChoiceChange={handleChoiceChange}
              handleDeleteQuestion={handleDeleteQuestion}
            />
          ))}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button onClick={addNewQuestion}>Add New Question</Button>
            <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
          </div>
        </div>
      )}
    </div>
  );
}
