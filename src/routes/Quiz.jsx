import { useCallback, useEffect, useState } from "react";
import shuffle from "lodash/shuffle";
import he from "he";
import { Link, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import logo from "../assets/react.svg";
import axios from "axios";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Finish from "./Finish";
export default function Quiz() {
  ////////////////////////////////////////////////////////////
  const details = JSON.parse(localStorage.getItem("details"));
  if (!details) {
    return <Navigate to="/login" />;
  }
  ////////////////////////////////////////////////////////////
  const [questions, setQuestions] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currQuestion, setCurrQuestion] = useState(
    questions && questions[currentQuestionIndex]
  );
  useEffect(() => {
    const cacheName = "quiz-cache";
    const cachePromise = caches.open(cacheName);
    cachePromise.then((cache) => {
      cache
        .match("https://opentdb.com/api.php?amount=10&type=multiple")
        .then((response) => {
          if (response) {
            return response.json();
          } else {
            return fetch(
              "https://opentdb.com/api.php?amount=10&type=multiple"
            ).then((response) => {
              cache.put(
                "https://opentdb.com/api.php?amount=10&type=multiple",
                response.clone()
              );
              return response.json();
            });
          }
        })
        .then((data) => {
          const updatedQuestions = data.results.map((question) => {
            return {
              ...question,
              question: question.question.replace(/&#?\w+;/g, (match) => {
                const entity = match.replace(/&#|;/g, "");
                const char = String.fromCharCode(entity);
                return char;
              }),
              option: shuffle([
                ...question.incorrect_answers,
                question.correct_answer,
              ]),
            };
          });
          setQuestions(updatedQuestions);
          setCurrQuestion(questions[currentQuestionIndex]);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
        });
    });
  }, [currentQuestionIndex]);
  console.log(questions);

  /////////////////////////////////////////////////////////////
  const [beginQuiz] = useState(false);
  /////////////////////////////////////////////////////////////

  const [doneQuestion, setDoneQuestion] = useState([]);
  const [passedQuestions, setPassedQuestions] = useState([]);
  const [failedQuestions, setFailedQuestions] = useState([]);
  /////////////////////////////////////////////////////////////
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl("");
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  /////////////////////////////////////////////////////////////
  const [scrolled, setScroll] = useState(false);
  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 20) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  /////////////////////////////////////////////////////////////
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const handleOptionClick = useCallback(
    (option) => {
      setShowAnswer(true);
      setSelectedOption(option);
    },
    [setShowAnswer, setSelectedOption]
  );
  /////////////////////////////////////////////////////////////
  const handleNextQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedOption(null);
    setDoneQuestion((prev) => {
      return [...prev, currQuestion];
    });
    if (selectedOption === questions[currentQuestionIndex].correct_answer) {
      setPassedQuestions((prev) => {
        return [...prev, currQuestion];
      });
    } else {
      setFailedQuestions((prev) => {
        return [...prev, currQuestion];
      });
    }
  };
  // /////////////////////////////////////////////////////////////
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setShowAnswer(true);
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };
  /////////////////////////////////////////////////////////////
  function handleSelect(option) {
    // settup passed questions failed questions and score count here
    if (option === questions[currentQuestionIndex].correct_answer) {
      return "bg-green-300";
    } else if (
      selectedOption === option &&
      selectedOption !== questions[currentQuestionIndex].correct_answer
    ) {
      return "bg-red-300";
    } else if (option === questions[currentQuestionIndex].correct_answer) {
      return "bg-blue-200";
    }
  }
  /////////////////////////////////////////////////////////////
  function logout() {
    const cacheName = "quiz-cache";
    caches.open(cacheName).then((cache) => {
      cache.delete("/api.php?amount=10&type=multiple").then((response) => {
        localStorage.removeItem("details");
        location.reload(true);
      });
    });
  }
  /////////////////////////////////////////////////////////////
  const quizData = {
    questions: questions,
    currQuestion: currQuestion,
    currentQuestionIndex: currentQuestionIndex,
    passedQuestions: passedQuestions,
    failedQuestions: failedQuestions,
    doneQuestion: doneQuestion,
  };
  const [gameFinish, setGameFinish] = useState(false);
  function toFinish() {
    if (currentQuestionIndex === 9) {
      setGameFinish(true);
    }
  }
  return (
    <>
      {questions ? (
        <>
          {!gameFinish ? (
            <div className="App">
              <nav
                style={{
                  backdropFilter: "blur(12px)",
                  borderBottom: "0.3px solid #d9d9d9",
                }}
                className={`md:px-32 px-2 ${
                  scrolled ? "bg-white filter:blur-md" : ""
                } bg-opacity-60 `}
              >
                <Link to={"/"}>
                  <div className="logo font-bold">
                    <img src={logo} alt="" />{" "}
                    <span className="text-xl">Quizzle</span>
                  </div>
                </Link>
                <div>
                  <button
                    aria-describedby={id}
                    variant="contained"
                    onClick={handleClick}
                    className="login--btn px-4 py-2 capitalize focus:ring-lime-500 font-bold"
                  >
                    {details.userName}
                  </button>
                </div>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    <div className="p-2 font-medium ">
                      <p className="py-1 capitalize">{details.userName}</p>
                      <p className="py-1">{details.email}</p>
                      <button
                        onClick={logout}
                        className="font-bold bg-red-200 my-2 px-4 py-1 rounded-lg"
                      >
                        Logout
                      </button>
                    </div>
                  </Typography>
                </Popover>
              </nav>
              {/* ///////////////////////////////////////////////////////////////////////////////////////////// */}
              <div className="question--view md:px-32 px-2  ">
                <div className="flex justify-between align-middle">
                  <div
                    className="question--number font-extralight my-3 text-lime-500 text-sm uppercase"
                    style={{
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      fontSize: "0.7em",
                    }}
                  >
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <div
                    className="score"
                    style={{
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontSize: "0.7em",
                      // borderBottom: "0.5px solid #d9d9d9"
                      textDecoration: "underline",
                      cursor: "default",
                    }}
                  >
                    Score: {passedQuestions.length}/{questions.length}
                  </div>
                </div>

                <div>
                  <p
                    style={{ fontFamily: "Roboto", color: "#1a1a1a" }}
                    className="lg:text-5xl text-3xl md:mt-10 font-bold  flex align-middle "
                  >
                    {questions[currentQuestionIndex].question}
                  </p>
                </div>
                <p
                  className={`showAns h-10  ${
                    selectedOption ===
                    questions[currentQuestionIndex].correct_answer
                      ? " text-green-400"
                      : "text-red-400"
                  } font-bold h-8 my-4`}
                >
                  <span className="font-medium  text-gray-700 opacity-60">
                    Answer:{" "}
                  </span>{" "}
                  {showAnswer && questions[currentQuestionIndex].correct_answer}
                </p>
                <div className="options py-1 mt-4">
                  {questions[currentQuestionIndex].option.map((options) => (
                    <>
                      <button
                        className={` mt-4 font-semibold border-2 px-4 mr-4 rounded-xl py-2 disabled:opacity-70  duration-300 transition-all hover:bg-lime-400 hover:bg-opacity-25
                    ${
                      selectedOption && handleSelect(options)
                    } disabled:cursor-not-allowed disabled:hover:bg-opacity-0  `}
                        onClick={() => handleOptionClick(options)}
                        disabled={selectedOption}
                        key={options}
                      >
                        {options}
                      </button>
                    </>
                  ))}
                </div>
              </div>
              <div className="navigation  px-32 py-8 mt-16 flex align-middle justify-end border-green-500">
                {/* TODO: enable previous button and make it possible to view previous question in the same state as
           it was left I.E the exact way it was */}

                {/* <button
              className={`prev font-semibold transition-all duration-300 disabled:cursor-not-allowed border ${
                currentQuestionIndex > 0
                  ? "bg-lime-500"
                  : "bg-neutral-200 text-neutral-600"
              } px-4 mr-4 rounded-xl py-2`}
              disabled={!currentQuestionIndex > 0}
              onClick={handlePreviousQuestion}
            >
              Previous
            </button> */}
                {currentQuestionIndex === 9 ? (
                  <button
                    className={`next font-semibold disabled:cursor-not-allowed transition-all duration-300 border ${
                      showAnswer
                        ? "bg-green-500 text-white hover:bg-green-400"
                        : "bg-neutral-200 text-neutral-600"
                    } px-4 mr-4 rounded-xl py-2`}
                    disabled={!showAnswer}
                    onClick={toFinish}
                  >
                    Finish
                  </button>
                ) : (
                  // </Link>
                  <button
                    className={`next font-semibold disabled:cursor-not-allowed transition-all duration-300 border ${
                      showAnswer
                        ? "bg-green-500 text-white hover:bg-green-400"
                        : "bg-neutral-200 text-neutral-600"
                    } px-4 mr-4 rounded-xl py-2`}
                    disabled={!showAnswer}
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          ) : (
            <Finish
              questions={questions}
              passedQuestions={passedQuestions}
              failedQuestions={failedQuestions}
            />
          )}
        </>
      ) : (
        <div className="App">
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
          <div className="info py-64 flex align-middle justify-center">
            <div>Please wait Loading...</div>
          </div>
        </div>
      )}
    </>
  );
}
