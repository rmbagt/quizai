"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FaStopwatch } from "react-icons/fa";
import { LuBookOpen } from "react-icons/lu";
import { quizData } from "~/app/data/quiz-data";
import { buttonVariants } from "~/components/ui/button";

export default function QuizPage() {
  const { id } = useParams();

  const quiz = quizData?.find((quiz) => quiz.id === id);

  return (
    <div className="flex min-h-screen flex-col px-10 py-14 md:px-32">
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border-2 p-4 shadow-sm">
        <h1 className="text-lg font-bold">Overview</h1>
        <h2 className="text-xl font-bold">{quiz?.title}</h2>
        <div className="flex flex-col gap-2 font-semibold">
          <div className="flex items-center gap-2">
            <FaStopwatch />
            <p>{quiz?.questions.length} questions</p>
          </div>
          <div className="flex items-center gap-2">
            <LuBookOpen />
            <p>{quiz?.duration} minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/play/quiz/${quiz?.id}`}
            className={buttonVariants({ variant: "default" })}
          >
            Start
          </Link>
          <Link href={``} className={buttonVariants({ variant: "outline" })}>
            Review
          </Link>
        </div>
      </div>
    </div>
  );
}
