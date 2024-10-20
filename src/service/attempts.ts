import { api } from "~/trpc/server";

export type QuizAttempt = {
  id: string;
  quizId: string;
  answers: unknown;
  score: number | null;
  userId: string;
  startedAt: Date;
  endedAt: Date | null;
};

export type QuizData = {
  theme: string;
  id: string;
  createdById: string;
  totalQuestions: number;
  workingTime: number;
};

export async function getAllAttempts() {
  const data = await api.quiz.getAllQuizzes();
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

  return { data, quizAttemptsMap };
}

export async function processAllQuizAttempts() {
  const { data: quizzes, quizAttemptsMap } = await getAllAttempts();
  let totalCorrect = 0;
  let totalWrong = 0;

  for (const quiz of quizzes) {
    const quizData = await api.quiz.getQuiz({ id: quiz.id });
    if (!quizData || !quizData.questions) continue;

    const attempts = quizAttemptsMap[quiz.id] ?? [];
    attempts.forEach((attempt) => {
      const userAnswers = attempt.answers as Record<string, number>;

      quizData.questions.forEach((question, index) => {
        if (userAnswers[index] === question.answer) {
          totalCorrect++;
        } else {
          totalWrong++;
        }
      });
    });
  }

  return { totalCorrect, totalWrong, totalAnswers: totalCorrect + totalWrong };
}
