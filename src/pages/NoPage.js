import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const NoPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>This page is not found!</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default NoPage;
