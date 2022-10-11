import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../ui/Navigation";

const Layout = () => {
  return (
    <Fragment>
      <Navigation />
      <Outlet />
    </Fragment>
  );
};

export default Layout;
