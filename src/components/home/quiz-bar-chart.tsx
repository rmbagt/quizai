"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Sun",
    total: Math.floor(Math.random() * 10),
  },
  {
    name: "Mon",
    total: Math.floor(Math.random() * 10),
  },
  {
    name: "Tue",
    total: Math.floor(Math.random() * 10),
  },
  {
    name: "Wed",
    total: Math.floor(Math.random() * 10),
  },
  {
    name: "Thu",
    total: Math.floor(Math.random() * 10),
  },
  {
    name: "Fri",
    total: Math.floor(Math.random() * 10),
  },
  {
    name: "Sat",
    total: Math.floor(Math.random() * 10),
  },
];

export function QuizBarChart() {
  return (
    <div className="flex flex-col justify-between gap-2 rounded-md border p-4 lg:w-1/2">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold">Activities</h2>
        <p className="text-sm font-medium text-gray-400">
          Your weekly quiz activities
        </p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
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
          <Bar
            dataKey="total"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
