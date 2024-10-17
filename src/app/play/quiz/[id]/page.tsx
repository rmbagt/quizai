"use client"

import { useState, useEffect } from 'react'
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog"

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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(quizData.length).fill(''))
  const [timeLeft, setTimeLeft] = useState(500) // time in seconds
  const [isQuizEnded, setIsQuizEnded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<'timeUp' | 'confirm' | 'completed'>('timeUp')

  useEffect(() => {
    if (isQuizEnded) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleQuizEnd('timeUp')
        }
        return prevTime > 0 ? prevTime - 1 : 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isQuizEnded])

  const handleQuizEnd = (reason: 'timeUp' | 'completed') => {
    setIsQuizEnded(true)
    setModalContent(reason)
    setShowModal(true)
  }

  const handleAnswerChange = (answer: string) => {
    if (isQuizEnded) return
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answer
    setUserAnswers(newAnswers)
  }

  const handlePrevious = () => {
    if (isQuizEnded) return
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    if (isQuizEnded) return
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setModalContent('confirm')
      setShowModal(true)
    }
  }

  const handleConfirmEnd = () => {
    handleQuizEnd('completed')
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
                  <RadioGroupItem value={answer} id={`answer-${index}`} disabled={isQuizEnded} />
                  <Label htmlFor={`answer-${index}`}>{answer}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0 || isQuizEnded}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={isQuizEnded}>
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
              onClick={() => !isQuizEnded && setCurrentQuestion(index)}
              disabled={isQuizEnded}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalContent === 'timeUp' && "Time's Up!"}
              {modalContent === 'confirm' && "Finish Quiz?"}
              {modalContent === 'completed' && "Congratulations!"}
            </DialogTitle>
            <DialogDescription>
              {modalContent === 'timeUp' && "Welp, time's up! Let's review how well you did."}
              {modalContent === 'confirm' && "Are you sure you want to finish the quiz?"}
              {modalContent === 'completed' && "You did it! Let's see how well you did."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {modalContent === 'confirm' ? (
              <>
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleConfirmEnd}>Confirm</Button>
              </>
            ) : (
              <Button onClick={() => setShowModal(false)}>Review Answers</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}