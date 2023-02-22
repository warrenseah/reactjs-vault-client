import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import LinkContainer from "react-router-bootstrap/LinkContainer";

function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>BNB-SuperCharger</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/deposit">
              <Nav.Link>Deposit</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/stakes">
              <Nav.Link>Stakes</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/rewards">
              <Nav.Link>Rewards</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/faq">
              <Nav.Link>Faq</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
