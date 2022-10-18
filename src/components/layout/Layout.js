import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <Fragment>
      <Navigation />
      <Outlet />
    </Fragment>
  );
};

export default Layout;
