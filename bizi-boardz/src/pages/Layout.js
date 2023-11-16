import { Outlet, Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const Layout = ({isLoggedIn}) => {
  return (
    <>
    {isLoggedIn &&
      <NavigationBar />
      }
      <Outlet />
    </>
  )
};

export default Layout;