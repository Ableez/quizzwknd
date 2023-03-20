import { useEffect, useState } from "react";
import logo from "../assets/react.svg";
import { Link } from "react-router-dom";
import "../assets/fonts.css";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Navigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";

export default function Question(props) {
  function startQuiz() {
    setBeginQuiz(true);
  }
  const goodReactions = [
    "1f389",
    "270c",
    "1f339",
    "1f64c",
    "1f44f",
    "2714",
    "2728",
    "1f38a",
  ];
  const badReactions = [
    "1f615",
    "1f614",
    "1f62d",
    "1f612",
    "1f620",
    "274c",
    "1f44e",
    "1f4a9",
  ];
  const [ansCorrect, setAnsCorrect] = useState(false);
  const handleOptionClick = (event) => {
    const selectedOption = event.target.value;
    const correctAnswer = props.currQuestion.correct_answer;
    const options = [...props.currQuestion.options];
    const selectedOptionIndex = options.indexOf(selectedOption);
    const correctAnswerIndex = options.indexOf(correctAnswer);
    props.setSelectedOption(selectedOption);
    if (!selectedOption === correctAnswer) {
      options.splice(correctAnswerIndex, 1);
      const randomIndex = Math.floor(Math.random() * options.length);
      options.splice(randomIndex, 0, correctAnswer);
      props.setSelectedOption(correctAnswer);
      props.setCurrQuestion((prevState) => ({
        ...prevState,
        options: options,
      }));
    }
  };

  function showReaction(ansCorrect, reactionType) {
    const reactions = reactionType === "good" ? goodReactions : badReactions;
    const randomIndex = Math.floor(Math.random() * reactions.length);
    const reactionCode = reactions[randomIndex];
    const reaction = String.fromCodePoint(parseInt(reactionCode, 16));

    return ansCorrect ? reaction : `${reaction}`;
  }
  const validateAnswer = (e) => {
    e.preventDefault();
    if (props.selectedOption) {
      props.setShowAns(true);
      console.log(props.selectedOption);
    }
    if (props.selectedOption === props.currQuestion.correct_answer) {
      setAnsCorrect(true);
    } else {
      setAnsCorrect(false);
    }
  };
  return (
    <div className="Quizbody  box-border">
      {props.endgame ? (
        <>
          <h2>Congrats</h2>
          <button
            // onClick={props.resetGame}
            className="bg-lime-500 text-white px-4 py-2 rounded-xl"
          >
            Reset Game
          </button>
        </>
      ) : (
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
                {props.currQuestionIndex + 1} of {props.questions.length}
              </span>
            </p>
          </div>
          <div className="question py-6">
            <h2 style={{ fontFamily: "Roboto" }} className="text-5xl font-bold">
              {/* {props.currQuestion.question} */}
              Hello There
            </h2>
          </div>
          <div className="options py-5">

          </div>
          <div className="displayAns text-lg flex align-middle py-10 font-semibold">
            <p>
              Answer:{" "}
              {props.showAns ? (
                <span
                  className={`${
                    ansCorrect ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {props.currQuestion.correct_answer}{" "}
                  {showReaction(ansCorrect, ansCorrect ? "good" : "bad")}
                </span>
              ) : (
                ""
              )}
            </p>
          </div>
          <div className="next--prev mt-5  flex justify-between">
            <button
              className={`px-14 ring-1 ring-zinc-200 hover:bg-gray-300 transition-all duration-300 text-zinc-900 bg-gray-300 font-bold mr-2 rounded-2xl py-2  ${
                !props.currQuestionIndex <= 0
                  ? "bg-lime-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed "
              }`}
              onClick={props.prevQuestion}
              value="prev"
            >
              Prev
            </button>
            {!props.showAns ? (
              <button
                className={`px-14 ring-1 rounded-2xl ring-zinc-200  transition-all duration-300 text-white ${
                  props.selectedOption
                    ? "bg-lime-600"
                    : "bg-gray-300 text-gray-900 cursor-not-allowed "
                } font-bold mr-2 rounded-2xl py-2`}
                onClick={validateAnswer}
              >
                {props.selectedOption ? "Check Answer" : "Next"}
              </button>
            ) : (
                  <button
                    className="px-14 ring-1 ring-zinc-200 rounded-2xl  transition-all duration-300 text-white bg-lime-600"
                    onClick={props.nextQuestion}
                  >
                    Next
                  </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
