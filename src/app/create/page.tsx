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

export default function CreateQuizPage() {
  const searchParams = useSearchParams();
  const { mutateAsync, isPending } = api.completions.generateQuiz.useMutation();
  const { mutateAsync: createQuiz } = api.quiz.createQuiz.useMutation();

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

  const handleSubmitQuiz = async () => {
    // Here you would typically send the quizData to your backend
    console.log("Submitting quiz:", quizData);
    await createQuiz(quizData);
    // You can add your API call here to save the quiz
  };

  return (
    <div className="flex min-h-screen flex-col px-4 py-8 md:px-8 lg:px-16">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create a New Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Label htmlFor="prompt">Tell me about your quiz</Label>
            <Textarea
              placeholder="Calculus quiz that covers derivatives and integrals"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              id="prompt"
            />
            <Label htmlFor="time">Time (in minutes)</Label>
            <Input
              placeholder="30"
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              id="time"
            />
            <Label htmlFor="number-of-questions">Number of Questions</Label>
            <Input
              placeholder="20"
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              id="number-of-questions"
            />

            <Button onClick={handleCreateQuiz} disabled={isPending}>
              {isPending ? "Generating..." : "Create Quiz"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {quizData.questions.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Edit Quiz Questions</h2>
          {quizData.questions.map((question, questionIndex) => (
            <QuizDisplay
              key={questionIndex}
              question={question}
              questionIndex={questionIndex}
              handleQuestionChange={handleQuestionChange}
              handleAnswerChange={handleAnswerChange}
              handleChoiceChange={handleChoiceChange}
            />
          ))}
          <div className="mt-4 flex justify-between">
            <Button onClick={addNewQuestion}>Add New Question</Button>
            <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
          </div>
        </div>
      )}
    </div>
  );
}
