import React from "react";
import { useParams } from "react-router-dom";

const QuizPage = () => {
    const { quizName } = useParams();  // Extract quiz name from URL

    return (
        <div className="quiz-page">
            <h1>Quiz: {decodeURIComponent(quizName)}</h1>
            <p>Quiz details will be shown here.</p>
        </div>
    );
};

export default QuizPage;
