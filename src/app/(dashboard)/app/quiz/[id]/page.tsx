import QuizPage from "~/components/quiz/quiz-play";
import { api } from "~/trpc/server";

export default async function Quiz({ params }: { params: { id: string } }) {
  const data = await api.quiz.getQuiz({ id: params.id });
  return (
    <div>
      <QuizPage quizData={data} />
    </div>
  );
}
