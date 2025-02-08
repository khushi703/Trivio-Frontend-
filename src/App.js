import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import QuizPage from "./pages/quizPage";  // Import the new Quiz Page component

const Navbar = () => {
    const location = useLocation();

    // Hide Navbar on Home Page
    if (location.pathname === "/") {
        return null;
    }

    return (
        <nav>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/home">Home</Link>
        </nav>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/quiz/:quizName" element={<QuizPage />} />  {/* Route for quizzes */}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
