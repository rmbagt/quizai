import { api } from "~/trpc/server";
import QuizPage from "./page.client";

export default async function Quiz({ params }: { params: { id: string } }) {
  const data = await api.quiz.getQuiz({ id: params.id });
  return (
    <div>
      <QuizPage quizData={data} />
    </div>
  );
}
