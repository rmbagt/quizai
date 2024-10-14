import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { RiFilePaper2Fill } from "react-icons/ri";

export default function QuizCard() {
  return (
    <div className="flex items-center justify-between gap-4 md:flex-col">
      <Card className="w-44">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Quiz</CardTitle>
          <RiFilePaper2Fill />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="text-lg font-bold">+20 quizzes</div>
          <p className="text-xs text-muted-foreground">+30% from last month</p>
        </CardContent>
      </Card>
      <Card className="w-44">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Spend</CardTitle>
          <MdOutlineAccessTimeFilled />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="text-xl font-bold">+8 hours</div>
          <p className="text-xs text-muted-foreground">
            +23.5% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
