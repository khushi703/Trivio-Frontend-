import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const QuizPage = () => {
    const { quizName } = useParams();
    const [participantName, setParticipantName] = useState("");
    const [quizStarted, setQuizStarted] = useState(localStorage.getItem("quizStarted") === "true");
    const [waiting, setWaiting] = useState(true);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // Fetch quiz data based on quizName
        const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
        const quiz = quizzes.find(q => q.name === decodeURIComponent(quizName));
        if (quiz) {
            setQuizData(quiz);
            setTimeLeft(quiz.time);
        }

        // Polling localStorage to check if quiz has started
        const interval = setInterval(() => {
            setQuizStarted(localStorage.getItem("quizStarted") === "true");
        }, 1000);

        return () => clearInterval(interval);
    }, [quizName]);

    useEffect(() => {
        if (quizStarted && quizData) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime === 0) {
                        handleNextQuestion();
                        return quizData.time;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quizStarted, quizData]);

    const handleJoin = () => {
        if (!participantName.trim()) {
            alert("Please enter your name to join.");
            return;
        }
        localStorage.setItem("participantName", participantName); // Store name
        setWaiting(false);
    };

    const handleNextQuestion = () => {
        if (selectedOption === quizData.questions[currentQuestionIndex].correct) {
            setScore(prevScore => prevScore + 1);
        }
        setSelectedOption("");
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            alert(`Quiz ended! Your score is ${score + (selectedOption === quizData.questions[currentQuestionIndex].correct ? 1 : 0)}`);
            setQuizStarted(false);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    if (!quizData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="quiz-page">
            <h1>Quiz: {decodeURIComponent(quizName)}</h1>

            {waiting ? (
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter Your Name" 
                        value={participantName} 
                        onChange={(e) => setParticipantName(e.target.value)} 
                    />
                    <button onClick={handleJoin}>Join Quiz</button>
                </div>
            ) : !quizStarted ? (
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