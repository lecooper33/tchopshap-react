import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import App from "./App.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]); 