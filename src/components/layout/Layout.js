import { Fragment } from "react";
import { Container } from "react-bootstrap";
import Navigation from "../ui/Navigation";

const Layout = (props) => {
  return (
    <Fragment>
      <Navigation />
      <Container>{props.children}</Container>
    </Fragment>
  );
};

export default Layout;
