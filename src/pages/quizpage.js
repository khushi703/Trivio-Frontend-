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
    const [timeUp, setTimeUp] = useState(false); // New state to track time-up condition
    const [submitted, setSubmitted] = useState(false); // New state to track submission

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
        const activeQuizName = localStorage.getItem("activeQuizName");

        const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
        console.log("Stored Quizzes:", quizzes);
        console.log("Quiz Name from URL:", decodeURIComponent(activeQuizName));

        const quiz = quizzes.find(q => q.name === decodeURIComponent(activeQuizName));
        if (quiz) {
            setQuizData(quiz);
        } else {
            console.error("Quiz not found!");
        }
    };

    useEffect(() => {
        fetchQuizData(); 
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const isStarted = localStorage.getItem("quizStarted") === "true";
            console.log("Quiz started status:", isStarted);
            setQuizStarted(isStarted);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (quizStarted && quizData) {
            setTimeLeft(parseInt(quizData.time, 10)); // Initialize timeLeft with the quiz time

            const timerInterval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timerInterval);
                        setTimeUp(true); // Set timeUp to true when the timer reaches 0
                        if (selectedOption) {
                            alert("Yes, your response is stored!");
                        } else {
                            alert("Time Up!");
                        }

                        return 0;
                    }
                });
            }, 1000);

            return () => clearInterval(timerInterval); // Cleanup the interval
        }
    }, [quizStarted, quizData]);

    const handleNextQuestion = () => {
        // Only process if time hasn't run out or an option has been selected
        if (!timeUp || selectedOption) {
            if (selectedOption === quizData.questions[currentQuestionIndex].correct) {
                setScore(prevScore => prevScore + 1);
            }

            setSelectedOption("");
            setTimeUp(false);
            setSubmitted(true);

            if (currentQuestionIndex < quizData.questions.length - 1) {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                setTimeLeft(parseInt(quizData.time, 10));  // Reset time for next question
            } else {
                alert(`Quiz ended! Your final score is ${score + (selectedOption === quizData.questions[currentQuestionIndex].correct ? 1 : 0)}`);
                setQuizStarted(false);
            }
        } else {
            alert("Time's up!  You didn't select an option.");
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
                                        disabled={timeUp} // Disable options when the timer is up
                                    />
                                    {option}
                                </div>
                            ))}
                        </div>
                        <p>Time left: {timeLeft} seconds</p>
                        {timeUp && !selectedOption && <p>Time is up!</p>}
                        <button onClick={handleNextQuestion} disabled={timeUp && !selectedOption}>
                            Next Question
                        </button>
                        {submitted && <p>Your last answer has been submitted!</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;