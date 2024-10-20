import React from "react";
import { processAllQuizAttempts } from "~/service/attempts";
import { QuizPieChartClient } from "./quiz-pie-chart.client";

export default async function QuizPieChart() {
  const { totalCorrect, totalWrong, totalAnswers } =
    await processAllQuizAttempts();
  return (
    <QuizPieChartClient
      totalCorrect={totalCorrect}
      totalWrong={totalWrong}
      totalAnswers={totalAnswers}
    />
  );
}
