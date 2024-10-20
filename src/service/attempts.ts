import { api } from "~/trpc/server";

export async function getAllAttempts<T extends { id: string }>({ quizData }: { quizData: T[] }) {
  // Fetch attempts for all quizzes
  const allAttempts = await Promise.all(
    quizData.map(async (quiz) => {
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
  const quizAttemptsMap = quizData.reduce(
    (acc, quiz, index) => {
      acc[quiz.id] = allAttempts[index] ?? [];
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
  const data = await api.quiz.getAllUserQuizAttempts();
  const { quizData, quizAttemptsMap } = await getAllAttempts({ quizData: data });
  let totalCorrect = 0;
  let totalWrong = 0;

  for (const quiz of quizData) {
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

interface WeeklyQuizStats {
  newQuizzes: {
    count: number;
    percentageChange: number;
  };
  userTotalTime: {
    minutes: number;
    displayTime: string; // Will contain formatted time string
    percentageChange: number;
  };
}

export async function getNewQuizzesAndUserTime(): Promise<WeeklyQuizStats> {
  const { data: quizzes, quizAttemptsMap } = await getAllAttempts();

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Calculate new quizzes
  const currentWeekQuizzes = quizzes.filter(
    (quiz) =>
      new Date(quiz.createdAt as Date) >= oneWeekAgo &&
      new Date(quiz.createdAt as Date) <= now,
  );

  const previousWeekQuizzes = quizzes.filter(
    (quiz) =>
      new Date(quiz.createdAt as Date) >= twoWeeksAgo &&
      new Date(quiz.createdAt as Date) < oneWeekAgo,
  );

  // Calculate time spent in minutes
  let currentWeekMinutes = 0;
  let previousWeekMinutes = 0;

  Object.entries(quizAttemptsMap).forEach(([_, attempts]) => {
    attempts.forEach((attempt) => {
      if (!attempt.startedAt || !attempt.endedAt) return;

      const attemptTimeMinutes =
        (new Date(attempt.endedAt).getTime() -
          new Date(attempt.startedAt).getTime()) /
        (1000 * 60);
      const attemptDate = new Date(attempt.startedAt);

      if (attemptDate >= oneWeekAgo && attemptDate <= now) {
        currentWeekMinutes += attemptTimeMinutes;
      } else if (attemptDate >= twoWeeksAgo && attemptDate < oneWeekAgo) {
        previousWeekMinutes += attemptTimeMinutes;
      }
    });
  });

  // Round minutes to nearest whole number
  currentWeekMinutes = Math.round(currentWeekMinutes);
  previousWeekMinutes = Math.round(previousWeekMinutes);

  // Format display time
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes < 1440) {
      // Less than 24 hours
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
      // Days and hours
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
  };

  // Calculate percentage changes
  const quizPercentageChange =
    previousWeekQuizzes.length === 0
      ? 100
      : ((currentWeekQuizzes.length - previousWeekQuizzes.length) /
          previousWeekQuizzes.length) *
        100;

  const timePercentageChange =
    previousWeekMinutes === 0
      ? 100
      : ((currentWeekMinutes - previousWeekMinutes) / previousWeekMinutes) *
        100;

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
