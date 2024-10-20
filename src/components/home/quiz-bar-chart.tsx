"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { QuizAttempt, QuizData } from "~/service/attempts";

type Props = {
  quizAttemptsMap: Record<string, QuizAttempt[]>;
  data: QuizData[];
};

export function QuizBarChart({ quizAttemptsMap, data }: Props) {
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(lastWeek.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const completedQuizzes = Object.values(quizAttemptsMap)
      .flat()
      .filter((attempt) => {
        const attemptDate = new Date(attempt.endedAt ?? "");
        return (
          attemptDate.toDateString() === date.toDateString() &&
          attempt.endedAt !== null
        );
      }).length;

    return {
      name: dayName,
      total: completedQuizzes,
    };
  });

  return (
    <div className="flex flex-col justify-between gap-2 rounded-md border p-4 lg:w-1/2">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">Activities</h2>
        <p className="text-sm font-medium text-gray-400">
          Your weekly quiz activities
        </p>
      </div>
      <ChartContainer
        config={{
          total: {
            label: "Completed Quizzes:",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-[250px]"
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
