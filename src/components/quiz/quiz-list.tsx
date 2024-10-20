"use client";

import React, { useEffect } from "react";
import { FaRobot, FaStopwatch, FaUserCheck } from "react-icons/fa";
import { LuBookOpen } from "react-icons/lu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "~/trpc/react";
import { ShareButton } from "../../app/(dashboard)/app/quiz/page.client";
import type { Quiz, QuizAttempt } from "@prisma/client";
import { toast } from "sonner";
import { Globe } from "lucide-react";

type QuizAttemptsMap = Record<string, QuizAttempt[]>;

interface QuizListClientProps {
  initialQuizzes: Quiz[];
  initialQuizAttemptsMap: QuizAttemptsMap;
  domain: string;
}

export function QuizListClient({
  initialQuizzes,
  initialQuizAttemptsMap,
  domain,
}: QuizListClientProps) {
  const [quizzes, setQuizzes] = React.useState<Quiz[]>(initialQuizzes);
  const [quizAttemptsMap, setQuizAttemptsMap] = React.useState<QuizAttemptsMap>(
    initialQuizAttemptsMap,
  );
  const utils = api.useUtils();
  const { data } = api.quiz.getAllQuizzes.useQuery();

  useEffect(() => {
    if (data) {
      setQuizzes(data);
    }
  }, [data]);

  const { mutate } = api.quiz.deleteQuiz.useMutation({
    onMutate: ({ id: quizId }) => {
      // Optimistically remove quiz from the list
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      // Remove quiz attempts from the map
      setQuizAttemptsMap((prev) => {
        const newMap = { ...prev };
        delete newMap[quizId];
        return newMap;
      });
      toast.info("Deleting quiz...");
      return { quizId };
    },
    onSuccess: (_, { id: quizId }) => {
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      toast.success("Quiz deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete quiz: ${error.message}`);
    },
  });

  const handleDelete = (quizId: string) => mutate({ id: quizId });
  const markAsAI = api.community.markQuizAsAIGenerated.useMutation({
    onSuccess: async ({ isGeneratedByAI }) => {
      toast.success(
        `Quiz ${isGeneratedByAI ? "marked" : "unmarked"} as AI Generated`,
      );
      await utils.quiz.getAllQuizzes.invalidate();
    },
  });
  const markAsVerified = api.community.verifyQuizByExpert.useMutation({
    onSuccess: async ({ isVerifiedByExpert }) => {
      toast.success(
        `Quiz ${isVerifiedByExpert ? "marked" : "unmarked"} as Verified by Expert`,
      );
      await utils.quiz.getAllQuizzes.invalidate();
    },
  });
  const setAsPublic = api.community.setQuizAsPublic.useMutation({
    onSuccess: async ({ isPublic }) => {
      toast.success(`Quiz ${isPublic ? "marked" : "unmarked"} as Public`);
      await utils.quiz.getAllQuizzes.invalidate();
    },
  });

  if (quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center text-lg text-muted-foreground">
        No quizzes found. Start by creating your first quiz!
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="line-clamp-2">{quiz.theme}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4 flex flex-wrap gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FaStopwatch
                      className="text-yellow-400"
                      aria-hidden="true"
                    />
                    <p>{quiz.totalQuestions} questions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuBookOpen className="text-green-500" aria-hidden="true" />
                    <p>{quiz.workingTime} minutes</p>
                  </div>
                  {quiz.isVerifiedByExpert && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <FaUserCheck className="h-3 w-3" />
                      Expert Verified
                    </Badge>
                  )}
                  {quiz.isGeneratedByAI && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <FaRobot className="h-3 w-3" />
                      AI Generated
                    </Badge>
                  )}
                  {quiz.isPublic && (
                    <Badge className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Public
                    </Badge>
                  )}
                </div>
                <motion.div
                  className="mt-4 border-t pt-4"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="mb-2 font-semibold">Attempt History</h3>
                  {quizAttemptsMap[quiz.id]?.length ? (
                    <ul className="space-y-2">
                      {quizAttemptsMap[quiz.id]
                        ?.slice(0, 3)
                        .map((attempt, index) => (
                          <li
                            key={attempt.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-medium">
                              Attempt{" "}
                              {(quizAttemptsMap[quiz.id]?.length ?? 0) - index}:
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${
                                  (attempt.score ?? 0) === quiz.totalQuestions
                                    ? "bg-green-500"
                                    : (attempt.score ?? 0) >=
                                          0.4 * quiz.totalQuestions &&
                                        (attempt.score ?? 0) <=
                                          0.7 * quiz.totalQuestions
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                } text-white`}
                              >
                                {attempt.score ?? 0}/{quiz.totalQuestions}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  attempt.startedAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No attempts yet
                    </p>
                  )}
                </motion.div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <ShareButton quiz={quiz} domain={domain} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/app/quiz/${quiz.id}?src=/app/quiz`}>
                        Start Quiz
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/app/quiz/${quiz.id}?mode=review&src=/app/quiz`}
                      >
                        Review
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      asChild
                      onClick={() =>
                        markAsAI.mutate({
                          quizId: quiz.id,
                          status: !quiz.isGeneratedByAI,
                        })
                      }
                    >
                      <span>
                        {quiz.isGeneratedByAI ? "Unmark" : "Mark"} quiz as AI
                        Generated
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      onClick={() =>
                        markAsVerified.mutate({
                          quizId: quiz.id,
                          status: !quiz.isVerifiedByExpert,
                        })
                      }
                    >
                      <span>
                        {quiz.isVerifiedByExpert ? "Unmark" : "Mark"} quiz as
                        Verified by Expert
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      onClick={() =>
                        setAsPublic.mutate({
                          quizId: quiz.id,
                          status: !quiz.isPublic,
                        })
                      }
                    >
                      <div className="flex flex-col items-start gap-0 text-left">
                        <span className="w-full">
                          {quiz.isPublic ? "Unmark" : "Mark"} quiz as Public
                        </span>
                        <span className="w-full text-xs text-muted-foreground">
                          (Available other to access)
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => handleDelete(quiz.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
