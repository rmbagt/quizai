export interface QuizQuestion {
    question: string;
    choices: string[];
    answer: number;
}

export interface QuizData {
    theme: string;
    questions: QuizQuestion[];
    workingTime: number;
}

