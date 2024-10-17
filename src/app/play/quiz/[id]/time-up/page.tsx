import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import Link from 'next/link'

export default function QuizResults() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Welp, time's up!</h1>
          <p className="text-lg mb-6 text-center">Let's review how well you did.</p>
          <div className="flex justify-center">
            <Link href="/quiz-review">
              <Button>Review Answers</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}