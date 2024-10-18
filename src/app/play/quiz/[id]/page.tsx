"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";

// Mock data for the quiz
const quizData = [
  {
    id: 1,
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    answers: ["Mars", "Venus", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  // Add more questions as needed
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(
    new Array(quizData.length).fill(""),
  );
  const [timeLeft, setTimeLeft] = useState(100); // 5 minutes in seconds
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<
    "timeUp" | "confirm" | "completed"
  >("timeUp");

  useEffect(() => {
    if (isQuizEnded) return;

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
  }, [isQuizEnded]);

  const getUnansweredQuestions = () => {
    return userAnswers.reduce((unanswered, answer, index) => {
      if (answer === "") {
        unanswered.push(index + 1);
      }
      return unanswered;
    }, [] as number[]);
  };

  const handleQuizEnd = (reason: "timeUp" | "completed") => {
    setIsQuizEnded(true);
    const unansweredQuestions = getUnansweredQuestions();
    setModalContent(reason);
    setShowModal(true);
    console.log("Unanswered questions:", unansweredQuestions);
    // You can use this information to display in the review or send to a server
  };

  const handleAnswerChange = (answer: string) => {
    if (isQuizEnded) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (isQuizEnded) return;
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    if (isQuizEnded) return;
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setModalContent("confirm");
      setShowModal(true);
    }
  };

  const handleConfirmEnd = () => {
    handleQuizEnd("completed");
  };

  const handleReviewAnswers = () => {
    // Implement the logic to review answers here
    console.log("Reviewing answers...");
    setShowModal(false);
    // You would typically navigate to a review page or show a review component here
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-grow p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">No.{currentQuestion + 1}</h2>
          <div className="text-xl font-semibold">{formatTime(timeLeft)}</div>
        </div>
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 text-xl">
              {quizData[currentQuestion].question}
            </h3>
            <RadioGroup
              value={userAnswers[currentQuestion]}
              onValueChange={handleAnswerChange}
            >
              {quizData[currentQuestion].answers.map((answer, index) => (
                <div key={index} className="mb-2 flex items-center space-x-2">
                  <RadioGroupItem
                    value={answer}
                    id={`answer-${index}`}
                    disabled={isQuizEnded}
                  />
                  <Label htmlFor={`answer-${index}`}>{answer}</Label>
                </div>
              ))}
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
            {currentQuestion === quizData.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
      <div className="w-64 bg-white p-8 shadow-lg">
        <h3 className="mb-4 text-xl font-bold">All Questions</h3>
        <div className="grid grid-cols-3 gap-2">
          {quizData.map((_, index) => (
            <Button
              key={index}
              variant={currentQuestion === index ? "default" : "outline"}
              onClick={() => !isQuizEnded && setCurrentQuestion(index)}
              disabled={isQuizEnded}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      <Dialog
        open={showModal}
        onOpenChange={modalContent === "confirm" ? setShowModal : undefined}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          {modalContent === "confirm" ? (
            <>
              <DialogHeader>
                <DialogTitle>Finish Quiz?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to finish the quiz?
                  {getUnansweredQuestions().length > 0 && (
                    <p className="mt-2 text-yellow-600">
                      Warning: You have {getUnansweredQuestions().length}{" "}
                      unanswered{" "}
                      {getUnansweredQuestions().length === 1
                        ? "question"
                        : "questions"}
                      .
                    </p>
                  )}
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
                {modalContent === "timeUp"
                  ? "Welp, time's up!"
                  : "Congratulations!"}
              </h1>
              <p className="mb-6 text-center text-lg">
                {modalContent === "timeUp"
                  ? "Let's review how well you did."
                  : "You did it! Let's see how well you did."}
              </p>
              {getUnansweredQuestions().length > 0 && (
                <p className="mb-4 text-center text-lg text-yellow-600">
                  You left {getUnansweredQuestions().length} questions
                  unanswered.
                </p>
              )}
              <div className="flex justify-center">
                <Button onClick={() => setShowModal(false)}>
                  Review Answers
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
