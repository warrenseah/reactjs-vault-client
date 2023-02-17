import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import CallToAction from "./CallToAction";

const Layout = () => {
  return (
    <Fragment>
      <Navigation />
      <Outlet />
      <CallToAction />
      <Footer />
    </Fragment>
  );
};

export default Layout;
