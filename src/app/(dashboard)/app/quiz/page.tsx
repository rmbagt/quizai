import { api } from "~/trpc/server";
import { FaStopwatch } from "react-icons/fa";
import { LuBookOpen } from "react-icons/lu";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Component() {
  const data = await api.quiz.getAllQuizzes();

  return (
    <main className="min-h-screen bg-gradient-to-b px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight sm:text-5xl">
          Saved Quizzes
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((quiz) => (
            <div
              key={quiz.id}
              className="group overflow-hidden rounded-lg border shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="p-6">
                <h2 className="mb-3 text-xl font-semibold">{quiz.theme}</h2>
                <div className="mb-4 flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaStopwatch className="text-blue-500" />
                    <p>{quiz.totalQuestions} questions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuBookOpen className="text-green-500" />
                    <p>{quiz.workingTime} minutes</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href={`/app/quiz/${quiz.id}`}>
                    <Button className="w-full transition-transform duration-300 ease-in-out hover:scale-105">
                      Start Quiz
                    </Button>
                  </Link>
                  <Link href={`/review/quiz/${quiz.id}`}>
                    <Button className="w-full transition-transform duration-300 ease-in-out hover:scale-105">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
