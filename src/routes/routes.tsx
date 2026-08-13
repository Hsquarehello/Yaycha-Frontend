import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Comments from "../pages/Comments";
import Profile from "../pages/Profile";
import Likes from "../pages/Likes";
import Search from "../pages/Search";
import Notis from "../pages/Noti";

export const routes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/comments/:id",
    element: <Comments />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/likes/:id/:type",
    element: <Likes />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/notis",
    element: <Notis />,
  },
];
