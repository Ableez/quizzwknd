import { Link } from "react-router-dom";
import logo from "../assets/react.svg";
import { useEffect, useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
const Finish = (props) => {
  ////////////////////////////////////////////////////////////////////////////////////
    const details = JSON.parse(localStorage.getItem("details"));
  //   if (!details) {
  //     return <Navigate to="/login" />;
  //   }
  ////////////////////////////////////////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////////////////////////
  function retry() {
    const cacheName = "quiz-cache";
    caches.open(cacheName).then((cache) => {
      cache.delete("/api.php?amount=10&type=multiple").then((response) => {
        location.reload(true);
      });
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////
  function logout() {
    const cacheName = "quiz-cache";
    caches.open(cacheName).then((cache) => {
      cache.delete("/api.php?amount=10&type=multiple").then((response) => {
        localStorage.removeItem("details");
        location.reload(true);
      });
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl("");
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  ////////////////////////////////////////////////////////////////////////////////////
  return (
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
            <img src={logo} alt="" /> <span className="text-xl">Quizzle</span>
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
      <div className="outcome lg:px-32 px-0  mt-8">
        <div className="info">
          <h2 className="text-4xl font-bold text-center">Quiz Finished</h2>
        </div>
        <div className="score lg:px-64 px-16 text-lg py-16">
          <p className="flex text-green-400 align-middle justify-between">
            <span>Passed: </span>
            <span>{props.passedQuestions.length}</span>
          </p>
          <p className="flex text-red-400 align-middle justify-between">
            <span>Failed: </span>
            <span>{props.failedQuestions.length}</span>
          </p>
          <p className="flex font-bold align-middle justify-between">
            <span>Overall: </span>
            <span>{props.questions.length}</span>
          </p>
        </div>
        {/* <div className="score px-64 text-lg py-8">
            <p className="flex text-green-400 align-middle justify-between"><span>Passed: </span><span>4</span></p>
            <p className="flex text-red-400 align-middle justify-between"><span>Failed: </span><span>6</span></p>
            <p className="flex font-bold align-middle justify-between"><span>Overall: </span><span>10</span></p>
        </div> */}
      </div>
      <div className="retry lg:px-32 px-2 mt-8 w-fit m-auto">
        <Link to="/">
          <button
            onClick={retry}
            className="rounded bg-lime-500 ring-1 ring-lime-600 px-16 transition-all duration-300 font-bold text-white hover:bg-lime-400 py-2"
          >
            Retry
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Finish;

// const quizData = {
//     questions: questions,
//     passedQuestions: passedQuestions,
//     failedQuestions: failedQuestions,
//   };
