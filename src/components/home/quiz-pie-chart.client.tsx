/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

import type { ChartConfig } from "~/components/ui/chart";

export const description = "Quiz Pie Chart";

const chartConfig = {
  numberOfAnswer: {
    label: "Answers",
  },
  wrong: {
    label: "Wrong",
    color: "hsl(var(--chart-1))",
  },
  correct: {
    label: "Correct",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function QuizPieChartClient({
  totalCorrect,
  totalWrong,
  totalAnswers,
}: {
  totalCorrect: number;
  totalWrong: number;
  totalAnswers: number;
}) {
  const chartData = [
    { answer: "wrong", numberOfAnswer: totalWrong, fill: "var(--color-wrong)" },
    {
      answer: "correct",
      numberOfAnswer: totalCorrect,
      fill: "var(--color-correct)",
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Answer</CardTitle>
        <CardDescription>
          Correct and wrong answer in last 1 week
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="numberOfAnswer"
              nameKey="answer"
              innerRadius={50}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalAnswers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Answers
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
