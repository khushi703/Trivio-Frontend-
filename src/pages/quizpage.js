import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const QuizPage = () => {
    const { quizName } = useParams();
    const [participantName, setParticipantName] = useState(localStorage.getItem("participantName") || "");
    const [quizStarted, setQuizStarted] = useState(false);
    const [waiting, setWaiting] = useState(true);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const handleJoin = () => {
        if (!participantName.trim()) {
            alert("Please enter your name to join.");
            return;
        }
        localStorage.setItem("participantName", participantName);
        setWaiting(false);
        fetchQuizData();
    };

    const fetchQuizData = () => {
        const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
        console.log("Stored Quizzes:", quizzes);
        console.log("Quiz Name from URL:", decodeURIComponent(quizName));

        const quiz = quizzes.find(q => q.name === decodeURIComponent(quizName));
        if (quiz) {
            setQuizData(quiz);
            setTimeLeft(quiz.time);
        } else {
            console.error("Quiz not found!");
        }
    };

    useEffect(() => {
        // Poll for quiz start
        const interval = setInterval(() => {
            const isStarted = localStorage.getItem("quizStarted") === "true";
            console.log("Quiz started status:", isStarted);
            setQuizStarted(isStarted);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleNextQuestion = () => {
        if (selectedOption === quizData.questions[currentQuestionIndex].correct) {
            setScore(prevScore => prevScore + 1);
        }
        setSelectedOption("");

        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            alert(`Quiz ended! Your final score is ${score + (selectedOption === quizData.questions[currentQuestionIndex].correct ? 1 : 0)}`);
            setQuizStarted(false);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    if (waiting) {
        return (
            <div>
                <input 
                    type="text" 
                    placeholder="Enter Your Name" 
                    value={participantName} 
                    onChange={(e) => setParticipantName(e.target.value)} 
                />
                <button onClick={handleJoin}>Join Quiz</button>
            </div>
        );
    }

    if (!quizData) {
        return <div>Loading quiz...</div>;
    }

    return (
        <div className="quiz-page">
            <h1>Quiz: {decodeURIComponent(quizName)}</h1>

            {!quizStarted ? (
                <h2>Waiting for the quiz to start...</h2>
            ) : (
                <div>
                    <h2>Quiz Started!</h2>
                    <div className="question-section">
                        <h3>{quizData.questions[currentQuestionIndex].question}</h3>
                        <div className="options">
                            {quizData.questions[currentQuestionIndex].options.map((option, index) => (
                                <div key={index} className="option">
                                    <input 
                                        type="radio" 
                                        name="option" 
                                        value={option} 
                                        checked={selectedOption === option}
                                        onChange={() => handleOptionSelect(option)}
                                    />
                                    {option}
                                </div>
                            ))}
                        </div>
                        <p>Time left: {timeLeft} seconds</p>
                        <button onClick={handleNextQuestion}>Next Question</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
