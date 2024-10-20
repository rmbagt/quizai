"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { ChartConfig } from "@/components/ui/chart";

export const description = "Enhanced Quiz Pie Chart";

const chartConfig = {
  numberOfAnswer: {
    label: "Answers",
  },
  wrong: {
    label: "Wrong",
    color: "hsl(var(--chart-3))",
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
    {
      answer: "wrong",
      numberOfAnswer: totalWrong,
      fill: "hsl(var(--chart-3))",
    },
    {
      answer: "correct",
      numberOfAnswer: totalCorrect,
      fill: "hsl(var(--chart-2))",
    },
  ];

  const correctPercentage = (totalCorrect / totalAnswers) * 100;
  const wrongPercentage = (totalWrong / totalAnswers) * 100;

  const getPerformanceColor = (percentage: number) => {
    if (percentage < 40) return "text-red-500";
    if (percentage < 70) return "text-yellow-500";
    return "text-green-500";
  };

  const performanceColor = getPerformanceColor(correctPercentage);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>Quiz Performance</CardTitle>
        <CardDescription>
          Correct and wrong answers in the last week
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
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
              innerRadius={60}
              outerRadius={80}
              strokeWidth={4}
              paddingAngle={2}
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
                          className={`fill-foreground text-3xl font-bold ${performanceColor}`}
                        >
                          {correctPercentage.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Correct
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
      <CardFooter>
        <div className="flex w-full justify-between text-sm">
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">Wrong</span>
            <span className="font-semibold text-red-500">
              {totalWrong} ({wrongPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">{totalAnswers}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground">Correct</span>
            <span className="font-semibold text-green-500">
              {totalCorrect} ({correctPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
