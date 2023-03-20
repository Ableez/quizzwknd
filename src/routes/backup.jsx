import { useCallback, useEffect, useMemo, useState } from "react";
import logo from "../assets/react.svg";
import { Link } from "react-router-dom";
import "../assets/fonts.css";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Navigate } from "react-router-dom";
import Question from "../Components/Question";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import shuffle from "lodash/shuffle";

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(null);
  const getCredentials = JSON.parse(localStorage.getItem("details"));
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&type=multiple")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const updatedQuestions = data.results.map((question) => {
          return {
            ...question,
            option: shuffle([
              ...question.incorrect_answers.map((answer) => {
                return answer.replace(/&#?\w+;/g, (match) => {
                  const entity = match.replace(/&#|;/g, "");
                  const char = String.fromCharCode(entity);
                  return char;
                });
              }),
              question.correct_answer.replace(/&#?\w+;/g, (match) => {
                const entity = match.replace(/&#|;/g, "");
                const char = String.fromCharCode(entity);
                return char;
              }),
            ]),
            question: question.question.replace(/&#?\w+;/g, (match) => {
              const entity = match.replace(/&#|;/g, "");
              const char = String.fromCharCode(entity);
              return char;
            }),
          };
        });
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  const [currQuestion, setCurrQuestion] = useState(
    questions[currentQuestionIndex]
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl("");
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [scrolled, setScroll] = useState(false);
  function logout() {
    localStorage.removeItem("details");
    localStorage.removeItem("prevQuestions");
    localStorage.removeItem("savedQuestions");
    window.location.reload();
  }

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

  const details = JSON.parse(localStorage.getItem("details"));
  if (!details) {
    return <Navigate to="/login" />;
  }

  const [beginQuiz] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const handleOptionClick = useCallback(
    (option) => {
      setShowAnswer(true);
      setSelectedOption(option);
    },
    [setShowAnswer, setSelectedOption]
  );
  const handleNextQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
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
  // console.log(
  //   "doneQuestions: ", doneQuestion, "Failed Questions: ", failedQuestions, "Passed Questions: ", passedQuestions
  // )


  console.log(currQuestion);
  return (
    <>
      {questions ? (
        <>
          <div className="questions h-fit ">
            <p
              style={{
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontSize: "0.7em",
              }}
              className="font-bold text-lime-700"
            >
              Question{" "}
              <span className="text-gray-400 ">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </p>
            <div className="questionHeader">
              <p
                style={{ fontFamily: "Roboto" }}
                className="text-5xl font-bold border-2 flex align-middle "
              >
                {questions[currentQuestionIndex].question}
              </p>
            </div>
            <div className="options">
              {currQuestion.option.map((options) => (
                <>
                  <button
                    className={` font-semibold px-6 mr-4 rounded-xl py-2 hover:bg-lime-200 duration-300 transition-all ${
                      options === selectedOption
                        ? "bg-green-400 hover:bg-green-500"
                        : "bg-lime-100 border-lime-700"
                    }`}
                    onClick={() => handleOptionClick(options)}
                    key={options}
                  >
                    {options}
                  </button>
                </>
              ))}
            </div>
          </div>
          <div className="h-6 ans">
            {showAnswer && (
              <p>Answer: {questions[currentQuestionIndex].correct_answer}</p>
            )}
          </div>

          <div className="btns">
            <button
              className="px-14 ring-1 ring-zinc-200 hover:bg-gray-300 transition-all duration-300 text-zinc-900 bg-gray-300 font-bold mr-2 rounded-2xl py-2"
              onClick={handlePreviousQuestion}
            >
              Prev
            </button>
            <button
              className="px-14 ring-1 ring-zinc-200  transition-all duration-300 text-white bg-lime-500 font-bold mr-2 rounded-2xl py-2"
              onClick={handleNextQuestion}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
}

// <div className="question">
// {questions.map((questionObj, index) => {
//   return (
//     <div className="question-card">
//       <h2 className="font-bold text-xl mb-2">
//         {index + 1}{" "}{questionObj.question}
//       </h2>
//       {questionObj.option.map((option) => {
//         return (
//           <button
//             className={` font-semibold px-6 mr-4 rounded-xl py-2 hover:bg-lime-200 duration-300 transition-all ${
//               option === selectedOption
//                 ? "bg-green-400 hover:bg-green-500"
//                 : "bg-lime-100 border-lime-700"
//             }`}
//           >
//             {option}
//           </button>
//         );
//       })}
//     </div>
//   );
// })}
// </div>