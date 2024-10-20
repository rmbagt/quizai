import { api } from "~/trpc/server";

import type { Quiz, QuizAttempt } from "@prisma/client";

type QuizLike = Quiz | QuizAttempt;

export async function getAllAttempts<T extends QuizLike>({ quizData }: { quizData: T[] }) {
  // Fetch attempts for all quizzes
  const allAttempts = await Promise.all(
    quizData.map(async (quiz) => {
      try {
        const quizId = 'quizId' in quiz ? quiz.quizId : quiz.id;
        const attempts = await api.quiz.getUserQuizAttempts({
          quizId,
        });
        return attempts.filter((attempt) => attempt.endedAt !== null);
      } catch (error) {
        console.error(`Error fetching attempts for quiz ${quiz.id}:`, error);
        return [];
      }
    }),
  );

  // Create a map of quiz attempts
  const quizAttemptsMap = quizData.reduce(
    (acc, quiz, index) => {
      const quizId = 'quizId' in quiz ? quiz.quizId : quiz.id;
      acc[quizId] = allAttempts[index] ?? [];
      return acc;
    },
    {} as Record<
      string,
      Awaited<ReturnType<typeof api.quiz.getUserQuizAttempts>>
    >,
  );

  return { quizData, quizAttemptsMap };
}

export async function processAllQuizAttempts() {
  const data: QuizAttempt[] = await api.quiz.getAllUserQuizAttempts();
  let totalCorrect = 0;
  let totalWrong = 0;

  data.forEach((attempt) => {
    const totalQuestions = attempt.answers && typeof attempt.answers === 'object' && attempt.answers !== null
      ? Object.keys(attempt.answers).length
      : 0;

    const score = attempt.score ?? 0;
    totalCorrect += score;
    totalWrong += totalQuestions - score;
  });

  const totalAnswers = totalCorrect + totalWrong;
  return { totalCorrect, totalWrong, totalAnswers };
}

interface WeeklyQuizStats {
  newQuizzes: {
    count: number;
    percentageChange: number;
  };
  userTotalTime: {
    minutes: number;
    displayTime: string;
    percentageChange: number;
  };
}

export async function getNewQuizzesAndUserTime(): Promise<WeeklyQuizStats> {
  const createdQuizzes = await api.quiz.getAllQuizzes();
  const attemptedQuiz = await api.quiz.getAllUserQuizAttempts();

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Calculate new quizzes
  const currentWeekQuizzes = createdQuizzes.filter(quiz => new Date(quiz.createdAt) >= oneWeekAgo);
  const previousWeekQuizzes = createdQuizzes.filter(quiz => new Date(quiz.createdAt) >= twoWeeksAgo && new Date(quiz.createdAt) < oneWeekAgo);

  const quizPercentageChange = previousWeekQuizzes.length !== 0
    ? ((currentWeekQuizzes.length - previousWeekQuizzes.length) / previousWeekQuizzes.length) * 100
    : 100;

  // Calculate user time
  const calculateTotalMinutes = (quizzes: typeof attemptedQuiz) =>
    quizzes.reduce((total, attempt) => total + attempt.quiz.workingTime, 0);

  const currentWeekAttempts = attemptedQuiz.filter(attempt => new Date(attempt.quiz.createdAt) >= oneWeekAgo);
  const previousWeekAttempts = attemptedQuiz.filter(attempt => new Date(attempt.quiz.createdAt) >= twoWeeksAgo && new Date(attempt.quiz.createdAt) < oneWeekAgo);

  const currentWeekMinutes = calculateTotalMinutes(currentWeekAttempts);
  const previousWeekMinutes = calculateTotalMinutes(previousWeekAttempts);

  const timePercentageChange = previousWeekMinutes !== 0
    ? ((currentWeekMinutes - previousWeekMinutes) / previousWeekMinutes) * 100
    : 100;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  return {
    newQuizzes: {
      count: currentWeekQuizzes.length,
      percentageChange: Math.round(quizPercentageChange * 10) / 10,
    },
    userTotalTime: {
      minutes: currentWeekMinutes,
      displayTime: formatTime(currentWeekMinutes),
      percentageChange: Math.round(timePercentageChange * 10) / 10,
    },
  };
}