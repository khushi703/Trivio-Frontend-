import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./home.css"; // Your CSS styles

const Home = () => {
    const [view, setView] = useState("home");
    const [quizName, setQuizName] = useState("");
    const [time, setTime] = useState("");
    const [questions, setQuestions] = useState([]);
    const [quizzes, setQuizzes] = useState([]); // Stores created quizzes
    const [qrCodeData, setQRCodeData] = useState("");

    // Handle adding a new question
    const addQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", ""], correct: "" }]);
    };

    // Add a new option to a question
    const addOption = (index) => {
        let newQuestions = [...questions];
        if (newQuestions[index].options.length < 6) {
            newQuestions[index].options.push("");
            setQuestions(newQuestions);
        }
    };

    // Save the quiz and update the sidebar
    const saveQuiz = () => {
        if (!quizName.trim()) {
            alert("Please enter a quiz name.");
            return;
        }

        const newQuiz = {
            name: quizName,
            time: time,
            questions: questions,
        };

        setQuizzes([...quizzes, newQuiz]); // Add quiz to sidebar
        setQuizName("");
        setTime("");
        setQuestions([]);
        setView("home");
    };

    // Load a quiz from the sidebar
    const loadQuiz = (quiz) => {
        setQuizName(quiz.name);
        setTime(quiz.time);
        setQuestions(quiz.questions);
        setView("addQuestions");
    };

    // Generate QR Code
    const generateQRCode = () => {
        const link = `https://trivio.com/quiz/${encodeURIComponent(quizName)}`;
        setQRCodeData(link);
        setView("qrCode");
    };

    return (
        <div className="app-container">
            {/* Left Sidebar */}
            <aside className="sidebar">
                <h2>Your Quizzes</h2>
                <ul>
                    {quizzes.map((quiz, index) => (
                        <li key={index} onClick={() => loadQuiz(quiz)}>
                            {quiz.name}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content */}
            <div className="home-container">
                {/* Navbar */}
                <nav className="navbar">
                    <h2 className="brand" onClick={() => setView("home")}>Trivio</h2>
                    <button className="profile-btn">Profile</button>
                </nav>

                {/* Content Switching */}
                {view === "home" && (
                    <div className="quiz-creation">
                        <h1>Welcome to <span className="brand">Trivio</span>!</h1>
                        <p>Test your knowledge, challenge your friends, and climb the leaderboard.</p>
                        <button className="primary-btn" onClick={() => setView("createQuiz")}>
                            Create Your Trivio
                        </button>
                    </div>
                )}

                {view === "createQuiz" && (
                    <div className="create-quiz">
                        <h2>Create Quiz</h2>
                        <input type="text" placeholder="Quiz Name" value={quizName} onChange={(e) => setQuizName(e.target.value)} />
                        <input type="number" placeholder="Time per Question (sec)" value={time} onChange={(e) => setTime(e.target.value)} />
                        <button onClick={() => setView("addQuestions")}>Add Questions</button>
                    </div>
                )}

                {view === "addQuestions" && (
                    <div className="add-questions">
                        <h2>Add Questions</h2>
                        {questions.map((q, index) => (
                            <div key={index} className="question-box">
                                <input type="text" placeholder="Enter Question" value={q.question} onChange={(e) => {
                                    let newQuestions = [...questions];
                                    newQuestions[index].question = e.target.value;
                                    setQuestions(newQuestions);
                                }} />
                                {q.options.map((option, i) => (
                                    <div key={i} className="option-group">
                                        <input type="radio" name={`correct-${index}`}
                                               checked={q.correct === option}
                                               onChange={() => {
                                                   let newQuestions = [...questions];
                                                   newQuestions[index].correct = option;
                                                   setQuestions(newQuestions);
                                               }}
                                        />
                                        <input type="text" placeholder={`Option ${i + 1}`} value={option} onChange={(e) => {
                                            let newQuestions = [...questions];
                                            newQuestions[index].options[i] = e.target.value;
                                            setQuestions(newQuestions);
                                        }} />
                                    </div>
                                ))}
                                <button onClick={() => addOption(index)}>Add Option</button>
                            </div>
                        ))}
                        <button onClick={addQuestion}>Add Question</button>
                        <button onClick={saveQuiz}>Save Quiz</button>
                        <button onClick={generateQRCode}>Generate QR Code</button>
                    </div>
                )}

                {view === "qrCode" && qrCodeData && (
                    <div className="qr-code-section">
                        <h2>Share Your Quiz</h2>
                        <QRCodeCanvas value={qrCodeData} size={200} />
                        <p>Share this QR Code or use this link: <a href={qrCodeData} target="_blank" rel="noopener noreferrer">{qrCodeData}</a></p>
                        <button onClick={() => setView("home")}>Back to Home</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
