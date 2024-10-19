import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";

export default function QuizResults() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="mb-4 text-center text-2xl font-bold">
            Welp, time&apos;s up!
          </h1>
          <p className="mb-6 text-center text-lg">
            Let&apos;s review how well you did.
          </p>
          <div className="flex justify-center">
            <Link href="/app/quiz-review">
              <Button>Review Answers</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
