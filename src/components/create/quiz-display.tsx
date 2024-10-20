import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizQuestion } from "~/types/quiz";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export function QuizDisplay({
  question,
  questionIndex,
  handleQuestionChange,
  handleAnswerChange,
  handleChoiceChange,
  handleDeleteQuestion,
}: {
  question: QuizQuestion;
  questionIndex: number;
  handleQuestionChange: (index: number, value: string) => void;
  handleAnswerChange: (index: number, value: number) => void;
  handleChoiceChange: (
    questionIndex: number,
    choiceIndex: number,
    value: string,
  ) => void;
  handleDeleteQuestion: (index: number) => void;
}) {
  return (
    <Card key={questionIndex} className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="h-max w-max">
          Question {questionIndex + 1}
        </CardTitle>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => handleDeleteQuestion(questionIndex)}
        >
          <Trash2 className="h-4 w-4" />
          <p className="sr-only">Delete question</p>
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          value={question.question}
          onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
          className="mb-4"
          placeholder="Enter question"
        />
        <RadioGroup
          value={question.answer.toString()}
          onValueChange={(value) =>
            handleAnswerChange(questionIndex, parseInt(value))
          }
        >
          {question.choices.map((choice, choiceIndex) => (
            <div key={choiceIndex} className="flex items-center space-x-2">
              <RadioGroupItem
                value={choiceIndex.toString()}
                id={`q${questionIndex}c${choiceIndex}`}
              />
              <Input
                value={choice}
                onChange={(e) =>
                  handleChoiceChange(questionIndex, choiceIndex, e.target.value)
                }
                placeholder={`Choice ${choiceIndex + 1}`}
                className="flex-grow"
              />
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
