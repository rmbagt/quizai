import Link from "next/link";
import { Button } from "../ui/button";

interface QuizTemplateProps {
  id: number;
  title: string;
  totalQuestions: number;
  time: number;
}

const quizTemplateData: QuizTemplateProps[] = [
  {
    id: 1,
    title: "Calculus",
    totalQuestions: 20,
    time: 10,
  },
  {
    id: 2,
    title: "Operating System",
    totalQuestions: 30,
    time: 15,
  },
  {
    id: 3,
    title: "Data Structure",
    totalQuestions: 25,
    time: 12,
  },
  {
    id: 4,
    title: "Algorithm",
    totalQuestions: 20,
    time: 10,
  },
];

export function QuizTemplate() {
  return (
    <div className="flex flex-col gap-2">
      {quizTemplateData.map((quiz) => (
        <div
          className="flex items-center justify-between rounded-md border p-3"
          key={quiz.id}
        >
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{quiz.title}</p>
            <p className="text-sm text-muted-foreground">
              {quiz.totalQuestions} questions | {quiz.time} minutes
            </p>
          </div>
          <Link href={`/create?prompt=${quiz.title}&time=${10}&question=${10}`}>
            <Button>Create Quiz</Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
