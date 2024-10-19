"use client";

import { useState, useEffect, useRef } from "react";
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
import type { Question, Quiz } from "@prisma/client";

export default function QuizPage({
  quizData,
}: {
  quizData: ({ questions: Question[] } & Quiz) | null;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<
    "timeUp" | "confirm" | "completed"
  >("timeUp");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (quizData) {
      setTimeLeft(quizData.workingTime * 60); // Convert minutes to seconds
      setUserAnswers(new Array(quizData.totalQuestions).fill(-1));
      resultRefs.current = new Array<HTMLDivElement | null>(
        quizData.totalQuestions,
      ).fill(null);
    }
  }, [quizData]);

  useEffect(() => {
    if (isQuizEnded || !quizData) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleQuizEnd("timeUp");
        }
        return prevTime > 0 ? prevTime - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuizEnded, quizData]);

  const handleQuizEnd = (reason: "timeUp" | "completed") => {
    setIsQuizEnded(true);
    setModalContent(reason);
    setShowModal(true);
    if (quizData) {
      const userScore = userAnswers.reduce((acc, answer, index) => {
        return acc + (answer === quizData.questions[index]?.answer ? 1 : 0);
      }, 0);
      setScore(userScore);
    }
  };

  const handleAnswerChange = (answer: number) => {
    if (isQuizEnded || !quizData) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (isQuizEnded) return;
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    if (isQuizEnded || !quizData) return;
    if (currentQuestion < quizData.totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setModalContent("confirm");
      setShowModal(true);
    }
  };

  const handleConfirmEnd = () => {
    handleQuizEnd("completed");
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

  return (
    <div className="flex min-h-screen">
      <div className="flex-grow overflow-y-auto p-8">
        {!showResults ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">No.{currentQuestion + 1}</h2>
              <div className="text-xl font-semibold">
                {formatTime(timeLeft)}
              </div>
            </div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl">
                  {quizData.questions[currentQuestion]?.question}
                </h3>
                <RadioGroup
                  value={userAnswers[currentQuestion]?.toString() ?? ""}
                  onValueChange={(value) => handleAnswerChange(parseInt(value))}
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
                          disabled={isQuizEnded}
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
                disabled={currentQuestion === 0 || isQuizEnded}
              >
                Previous
              </Button>
              <Button onClick={handleNext} disabled={isQuizEnded}>
                {currentQuestion === quizData.totalQuestions - 1
                  ? "Finish"
                  : "Next"}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Quiz Results</h2>
            <div className="mb-4 text-xl font-semibold">
              Your Score: {score} / {quizData.totalQuestions} (
              {((score / quizData.totalQuestions) * 100).toFixed(2)}%)
            </div>
            {quizData.questions.map((question, index) => (
              <Card
                key={index}
                className="p-6"
                ref={(el) => {
                  resultRefs.current[index] = el;
                }}
              >
                <h3 className="mb-4 text-xl font-semibold">
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
      <div className="sticky top-0 h-screen w-64 overflow-y-auto bg-secondary p-8 shadow-lg">
        <h3 className="mb-4 text-xl font-bold">All Questions</h3>
        <div className="grid grid-cols-3 gap-2">
          {Array.from(
            { length: quizData ? quizData.totalQuestions : 0 },
            (_, index) => (
              <Button
                key={index}
                variant={
                  currentQuestion === index && !showResults
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  showResults
                    ? scrollToQuestion(index)
                    : setCurrentQuestion(index)
                }
                disabled={isQuizEnded && !showResults}
                className={`${
                  userAnswers[index] !== -1
                    ? showResults
                      ? userAnswers[index] === quizData.questions[index]?.answer
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                    : ""
                }`}
              >
                {index + 1}
              </Button>
            ),
          )}
        </div>
      </div>

      <Dialog
        open={showModal}
        onOpenChange={modalContent === "confirm" ? setShowModal : undefined}
      >
        <DialogContent className="sm:max-w-[425px]">
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
              <h1 className="mb-4 text-center text-4xl font-bold">
                {modalContent === "timeUp" ? "Time's up!" : "Quiz Completed!"}
              </h1>
              <p className="mb-6 text-center text-lg">
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
