import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizQuestion } from "~/types/quiz";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

export function QuizDisplay({
  question,
  questionIndex,
  handleQuestionChange,
  handleAnswerChange,
  handleChoiceChange,
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
}) {
  return (
    <Card key={questionIndex} className="mb-6">
      <CardHeader>
        <CardTitle>Question {questionIndex + 1}</CardTitle>
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
