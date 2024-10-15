"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"

// Mock data for the quiz
const quizData = [
  {
    id: 1,
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    answers: ["Mars", "Venus", "Jupiter", "Saturn"],
    correctAnswer: "Mars"
  },
  // Add more questions as needed
]

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(quizData.length).fill(''))
  const [timeLeft, setTimeLeft] = useState(3000) // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleQuizEnd()
        }
        return prevTime > 0 ? prevTime - 1 : 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleQuizEnd = () => {
    // In a real application, you might want to save the answers to a database here
    // For now, we'll just redirect to a results page
    router.push('/quiz-results')
  }

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answer
    setUserAnswers(newAnswers)
  }

  const handlePrevious = () => {
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleQuizEnd()
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-100 flex pt-4">
      <div className="flex-grow p-8">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">No.{currentQuestion + 1}</h2>
          <div className="text-xl font-semibold">{formatTime(timeLeft)}</div>
        </div>
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl mb-4">{quizData[currentQuestion].question}</h3>
            <RadioGroup value={userAnswers[currentQuestion]} onValueChange={handleAnswerChange}>
              {quizData[currentQuestion].answers.map((answer, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={answer} id={`answer-${index}`} />
                  <Label htmlFor={`answer-${index}`}>{answer}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentQuestion === quizData.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
      <div className="w-64 p-8 bg-white shadow-lg">
        <h3 className="text-xl font-bold mb-4">All Questions</h3>
        <div className="grid grid-cols-3 gap-2">
          {quizData.map((_, index) => (
            <Button
              key={index}
              variant={currentQuestion === index ? "default" : "outline"}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}