import { api } from "~/trpc/server";
import { headers } from "next/headers";
import { QuizListClient } from "./quiz-list-client";

export default async function QuizListServer() {
  const data = await api.quiz.getAllQuizzes();
  const headerList = headers();
  const domain =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "quiz-ai.rey.mba";

  // Fetch attempts for all quizzes
  const allAttempts = await Promise.all(
    data.map(async (quiz) => {
      try {
        const attempts = await api.quiz.getUserQuizAttempts({
          quizId: quiz.id,
        });
        return attempts.filter((attempt) => attempt.endedAt !== null);
      } catch (error) {
        console.error(`Error fetching attempts for quiz ${quiz.id}:`, error);
        return []; // Return an empty array if there's an error
      }
    }),
  );

  // Create a map of quiz attempts
  const quizAttemptsMap = data.reduce(
    (acc, quiz, index) => {
      acc[quiz.id] = allAttempts[index] ?? [];
      return acc;
    },
    {} as Record<
      string,
      Awaited<ReturnType<typeof api.quiz.getUserQuizAttempts>>
    >,
  );

  console.log(quizAttemptsMap);

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
