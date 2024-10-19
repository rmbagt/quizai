import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QuizQuestion {
  question?: string;
  choices?: string[];
  answer?: number;
}

interface QuizData {
  theme?: string;
  questions?: QuizQuestion[];
}

interface QuizDisplayProps {
  quizData: QuizData;
  isGenerating: boolean;
}

export default function QuizDisplay({
  quizData,
  isGenerating,
}: QuizDisplayProps) {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-bold">Generated Quiz</h2>

      {isGenerating && (
        <Alert>
          <AlertTitle>Generating Quiz</AlertTitle>
          <AlertDescription>
            Please wait while we create your quiz. The content will appear here
            as it's generated.
          </AlertDescription>
        </Alert>
      )}

      {quizData.theme && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Theme: {quizData.theme}</CardTitle>
          </CardHeader>
        </Card>
      )}

      {quizData.questions &&
        quizData.questions.map((question, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle>Question {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              {question.question ? (
                <p className="mb-2 font-medium">{question.question}</p>
              ) : (
                <p className="mb-2 italic text-gray-500">Loading question...</p>
              )}
              {question.choices && question.choices.length > 0 ? (
                <ol className="list-inside list-decimal">
                  {question.choices.map((choice, choiceIndex) => (
                    <li
                      key={choiceIndex}
                      className={
                        question.answer !== undefined &&
                        choiceIndex === question.answer - 1
                          ? "font-bold"
                          : ""
                      }
                    >
                      {choice}
                      {question.answer !== undefined &&
                        choiceIndex === question.answer - 1 &&
                        " (Correct Answer)"}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="italic text-gray-500">Loading choices...</p>
              )}
            </CardContent>
          </Card>
        ))}

      {(!quizData.questions || quizData.questions.length === 0) &&
        !isGenerating && (
          <Alert>
            <AlertTitle>No Questions Generated</AlertTitle>
            <AlertDescription>
              No questions have been generated yet. Try creating a quiz using
              the form above.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
