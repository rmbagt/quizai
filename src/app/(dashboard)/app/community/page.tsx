import { api } from "~/trpc/server";
import { CommunityClient } from "./page.client";
import { getAllAttempts } from "~/service/attempts";
import { type QuizWithUser } from "~/types/community";

export default async function Community() {
  const data = await api.community.getCommunityQuizzes();
  const { quizData, quizAttemptsMap } = await getAllAttempts<QuizWithUser>({
    quizData: data,
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Community Quizzes
        </h1>
        <CommunityClient
          initialQuizzes={quizData}
          initialQuizAttemptsMap={quizAttemptsMap}
        />
      </div>
    </main>
  );
}
