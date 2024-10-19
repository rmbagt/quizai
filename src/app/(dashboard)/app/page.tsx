import { QuizBarChart } from "~/components/home/quiz-bar-chart";
import QuizCard from "~/components/home/quiz-card";
import { QuizPieChart } from "~/components/home/quiz-pie-chart";
import { QuizTemplate } from "~/components/home/quiz-template";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-6 px-10 py-14 md:px-24">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">Overview</h1>
        <div className="flex h-max flex-col gap-6 lg:flex-row">
          <QuizCard />
          <QuizBarChart />
          <QuizPieChart />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">Try ask this out!</h1>
        <QuizTemplate />
      </div>
    </main>
  );
}
