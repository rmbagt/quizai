import type { Quiz, QuizAttempt, User } from "@prisma/client";

export type QuizWithUser = Quiz & { createdBy: User };

export interface CommunityClientProps {
    initialQuizzes: QuizWithUser[];
    initialQuizAttemptsMap: Record<string, QuizAttempt[]>;
}