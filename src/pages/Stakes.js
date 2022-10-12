import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import UserContext from "../store/user-context";

const Stakes = () => {
  const userCtx = useContext(UserContext);
  if(!userCtx.address) {
    return <Navigate to='/' replace />;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>This is Stakes Page</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Stakes;
