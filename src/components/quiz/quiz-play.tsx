"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import type { Question, Quiz } from "@prisma/client";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function QuizPage({
  quizData,
  className,
  userAnswers: initialUserAnswers,
}: {
  className?: string;
  quizData: ({ questions: Question[] } & Quiz) | null;
  userAnswers?: number[];
}) {
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get("mode") === "review";
  const utils = api.useUtils();
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizEnded, setIsQuizEnded] = useState(isReviewMode);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<
    "timeUp" | "confirm" | "completed"
  >("timeUp");
  const [showResults, setShowResults] = useState(isReviewMode);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [score, setScore] = useState(0);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);

  const startQuizAttempt = api.quiz.startQuizAttempt.useMutation();
  const saveQuizSnapshot = api.quiz.saveQuizSnapshot.useMutation();
  const endQuizAttempt = api.quiz.endQuizAttempt.useMutation();

  useEffect(() => {
    if (quizData && !isReviewMode) {
      startQuizAttempt.mutate(
        { quizId: quizData.id },
        {
          onSuccess: (data) => setQuizAttemptId(data.id),
        },
      );
    }
  }, [quizData, isReviewMode]);

  useEffect(() => {
    if (!isQuizEnded && quizAttemptId) {
      const saveInterval = setInterval(() => {
        saveQuizSnapshot.mutate({
          quizAttemptId,
          answers: Object.fromEntries(userAnswers.entries()),
        });
      }, 5 * 1000); // Save every 30 seconds

      return () => clearInterval(saveInterval);
    }
  }, [isQuizEnded, quizAttemptId, userAnswers]);

  useEffect(() => {
    if (quizData) {
      setTimeLeft(quizData.workingTime * 60);
      setUserAnswers(
        initialUserAnswers ?? new Array(quizData.totalQuestions).fill(-1),
      );
      resultRefs.current = new Array<HTMLDivElement | null>(
        quizData.totalQuestions,
      ).fill(null);

      if (isReviewMode) {
        const userScore =
          initialUserAnswers?.reduce((acc, answer, index) => {
            return acc + (answer === quizData.questions[index]?.answer ? 1 : 0);
          }, 0) ?? 0;
        setScore(userScore);
      }
    }
  }, [quizData, initialUserAnswers, isReviewMode]);

  useEffect(() => {
    if (isQuizEnded || !quizData || isReviewMode) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleQuizEnd("timeUp").catch(console.error);
        }
        return prevTime > 0 ? prevTime - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizEnded, quizData, isReviewMode]);

  const handleQuizEnd = async (reason: "timeUp" | "completed") => {
    setIsQuizEnded(true);
    setModalContent(reason);
    setShowModal(true);
    await utils.quiz.getUserQuizAttempts.invalidate();
    await utils.quiz.getUserQuizAttempts.prefetch({
      quizId: quizData?.id,
    });
    if (quizData) {
      const userScore = userAnswers.reduce((acc, answer, index) => {
        return acc + (answer === quizData.questions[index]?.answer ? 1 : 0);
      }, 0);
      setScore(userScore);

      if (quizAttemptId) {
        endQuizAttempt.mutate({
          quizAttemptId,
          answers: Object.fromEntries(userAnswers.entries()),
          score: userScore, // Use the calculated userScore here
        });
      }
    }
  };

  const handleAnswerChange = (answer: number) => {
    if (isQuizEnded || !quizData || isReviewMode) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (isQuizEnded && !isReviewMode) return;
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    if ((isQuizEnded && !isReviewMode) || !quizData) return;
    if (currentQuestion < quizData.totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else if (!isReviewMode) {
      setModalContent("confirm");
      setShowModal(true);
    }
  };

  const handleConfirmEnd = async () => {
    await handleQuizEnd("completed");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleReviewAnswers = () => {
    setShowModal(false);
    setShowResults(true);
  };

  const scrollToQuestion = (index: number) => {
    resultRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  if (!quizData) {
    return <div>Quiz not found</div>;
  }

  const progressPercentage =
    ((currentQuestion + 1) / quizData.totalQuestions) * 100;

  const QuestionNavigation = ({ isMobile = false }) => (
    <div
      className={cn(
        `${
          isMobile
            ? ""
            : "sticky top-0 h-svh w-64 overflow-y-auto bg-secondary p-4"
        }`,
        className,
      )}
    >
      <h3 className="mb-4 text-xl font-bold">All Questions</h3>
      <span className={isMobile ? "hidden" : "mb-4 block text-balance text-sm"}>
        Navigate to any question or check your progress
      </span>
      <div className={`grid ${isMobile ? "grid-cols-4" : "grid-cols-3"} gap-2`}>
        {Array.from({ length: quizData.totalQuestions }, (_, index) => (
          <Button
            key={index}
            variant={currentQuestion === index ? "default" : "outline"}
            onClick={() => {
              setCurrentQuestion(index);
              scrollToQuestion(index);
              if (isMobile) {
                setIsSheetOpen(false);
              }
            }}
            disabled={isQuizEnded && !showResults && !isReviewMode}
            className={`${
              userAnswers[index] !== -1
                ? showResults || isReviewMode
                  ? userAnswers[index] === quizData.questions[index]?.answer
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
                : ""
            }`}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100svh-24rem)] flex-col lg:flex-row">
      <div className="flex flex-1 flex-col">
        <div className={cn("sticky top-0", className)}>
          <div className="flex items-center justify-between bg-secondary p-4">
            <h2 className="ml-8 text-xl font-bold">Quiz</h2>
            {!isReviewMode && (
              <div className="text-lg font-semibold">
                {formatTime(timeLeft)}
              </div>
            )}
            <div className="lg:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="size-7" size="icon">
                    <Menu className="size-2" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>All Questions</SheetTitle>
                    <SheetDescription>
                      Navigate to any question or check your progress
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4">
                    <QuestionNavigation isMobile={true} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 w-full rounded-none"
          />
        </div>

        <div className="flex-grow overflow-y-auto p-4 md:p-8">
          {!showResults ? (
            <>
              <Card className="mb-6">
                <CardContent className="p-4 md:p-6">
                  <h3 className="mb-4 text-lg md:text-xl">
                    {quizData.questions[currentQuestion]?.question}
                  </h3>
                  <RadioGroup
                    value={userAnswers[currentQuestion]?.toString() ?? ""}
                    onValueChange={(value) =>
                      handleAnswerChange(parseInt(value))
                    }
                  >
                    {quizData.questions[currentQuestion]?.choices.map(
                      (choice, index) => (
                        <div
                          key={index}
                          className="mb-2 flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`answer-${index}`}
                            disabled={isQuizEnded || isReviewMode}
                          />
                          <Label htmlFor={`answer-${index}`}>{choice}</Label>
                        </div>
                      ),
                    )}
                  </RadioGroup>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isQuizEnded && !isReviewMode}
                  className="flex items-center"
                >
                  {currentQuestion === quizData.totalQuestions - 1 ? (
                    "Finish"
                  ) : (
                    <>
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <ArrowLeft
                  onClick={() => {
                    router.push("/app/quiz");
                    router.refresh();
                  }}
                  className="h-6 w-6 cursor-pointer"
                />
                <h2 className="text-2xl font-bold md:text-3xl">Quiz Results</h2>
              </div>
              <div className="mb-4 text-lg font-semibold md:text-xl">
                Your Score: {score} / {quizData.totalQuestions} (
                {((score / quizData.totalQuestions) * 100).toFixed(2)}%)
              </div>
              {quizData.questions.map((question, index) => (
                <Card
                  key={index}
                  className="p-4 md:p-6"
                  ref={(el) => {
                    resultRefs.current[index] = el;
                  }}
                >
                  <h3 className="mb-4 text-lg font-semibold md:text-xl">
                    Question {index + 1}: {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.choices.map((choice, choiceIndex) => (
                      <div
                        key={choiceIndex}
                        className={`rounded p-2 ${
                          choiceIndex === question?.answer
                            ? "bg-green-100 dark:bg-green-800"
                            : userAnswers[index] === choiceIndex
                              ? "bg-red-100 dark:bg-red-800"
                              : ""
                        }`}
                      >
                        {choice}
                        {choiceIndex === question?.answer && (
                          <span className="ml-2 text-green-600 dark:text-green-400">
                            ✓ Correct Answer
                          </span>
                        )}
                        {userAnswers[index] === choiceIndex &&
                          choiceIndex !== question?.answer && (
                            <span className="ml-2 text-red-600 dark:text-red-400">
                              ✗ Your Answer
                            </span>
                          )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <QuestionNavigation />
      </div>

      <Dialog
        open={showModal}
        onOpenChange={modalContent === "confirm" ? setShowModal : undefined}
      >
        <DialogContent className="max-w-sm rounded-md">
          {modalContent === "confirm" ? (
            <>
              <DialogHeader>
                <DialogTitle>Finish Quiz?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to finish the quiz?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmEnd}>Confirm</Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex w-full flex-col items-center justify-center p-8">
              <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl">
                {modalContent === "timeUp" ? "Time's up!" : "Quiz Completed!"}
              </h1>
              <p className="mb-6 text-center text-base md:text-lg">
                {modalContent === "timeUp"
                  ? "Let's review your answers."
                  : "Great job! Let's see how you did."}
              </p>
              <div className="flex justify-center">
                <Button onClick={handleReviewAnswers}>Review Answers</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
