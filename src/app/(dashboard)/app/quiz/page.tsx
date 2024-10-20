import { headers } from "next/headers";
import { QuizListClient } from "./quiz-list-client";
import { getAllAttempts } from "@/service/attempts";

export default async function QuizListServer() {
  const headerList = headers();
  const domain =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "quiz-ai.rey.mba";

  const { data, quizAttemptsMap } = await getAllAttempts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Your Quiz Collection
        </h1>
        <QuizListClient
          initialQuizzes={data}
          initialQuizAttemptsMap={quizAttemptsMap}
          domain={domain}
        />
      </div>
    </main>
  );
}
