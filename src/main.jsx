import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import Login from "./routes/Loginpage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Quiz from "./routes/Quiz";
import Finish from "./routes/Finish";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "quiz",
    element: <Quiz />,
  },
  {
    path: "finish",
    element: <Finish />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
