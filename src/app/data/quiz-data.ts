interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  duration: number;
  numberOfQuestions: number;
}

export const quizData: Quiz[] = [
  {
    id: "1",
    title: "Calculus Quiz",
    questions: [
      {
        id: "1",
        question: "What is the derivative of 2x?",
        options: ["2", "1", "0", "x"],
        answer: "2",
      },
      {
        id: "2",
        question: "What is the integral of x^2?",
        options: ["x^3", "x^2", "x", "x^4"],
        answer: "x^3",
      },
    ],
    duration: 30,
    numberOfQuestions: 2,
  },
  {
    id: "2",
    title: "Physics Quiz",
    questions: [
      {
        id: "1",
        question: "What is the formula for force?",
        options: ["F = ma", "F = mv", "F = m", "F = a"],
        answer: "F = ma",
      },
      {
        id: "2",
        question: "What is the formula for acceleration?",
        options: ["a = F/m", "a = F*v", "a = F", "a = v"],
        answer: "a = F/m",
      },
    ],
    duration: 30,
    numberOfQuestions: 2,
  },
];
