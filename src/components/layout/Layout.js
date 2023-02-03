import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";

const Layout = () => {
  return (
    <Fragment>
      <Navigation />
      <Outlet />
      <Footer />
    </Fragment>
  );
};

export default Layout;
