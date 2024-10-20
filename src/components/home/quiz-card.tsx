import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { RiFilePaper2Fill } from "react-icons/ri";
import { getNewQuizzesAndUserTime } from "~/service/attempts";

export default async function QuizCard() {
  const { newQuizzes, userTotalTime } = await getNewQuizzesAndUserTime();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Quiz</CardTitle>
          <RiFilePaper2Fill className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col justify-end">
          <div className="text-2xl font-bold md:text-xl">
            +{newQuizzes.count} quizzes
          </div>
          <p className="text-xs text-muted-foreground">
            {newQuizzes.percentageChange >= 0 ? "+" : ""}
            {newQuizzes.percentageChange}% from last week
          </p>
        </CardContent>
      </Card>
      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
          <MdOutlineAccessTimeFilled className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col justify-end">
          <div className="text-2xl font-bold md:text-xl">
            +{userTotalTime.displayTime}
          </div>
          <p className="text-xs text-muted-foreground">
            {userTotalTime.percentageChange >= 0 ? "+" : ""}
            {userTotalTime.percentageChange}% from last week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
