import { Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { ethers } from "ethers";
import { convertToDateTime, haveTimePast } from "../../lib/utils";

function WithdrawalCards(props) {
  let count = 0;

  if (props.items.length === 0) {
    return <p>No Withdrawal.</p>;
  }

  return (
      <Row md={2} className="g-4">
        {props.items.map((item) => (
          <Col key={item.id.toString()}>
            <Card>
              <Card.Header>Withdrawal Card {++count}</Card.Header>
              <Card.Body>
                <Card.Title>{`WithdrawalId: ${
                  item.id.toNumber() + 1
                }`}</Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  Amount: {ethers.utils.formatUnits(item.amountInTokens)} BNB
                </ListGroup.Item>
                <ListGroup.Item>
                  Lock Till: {convertToDateTime(item.end.toNumber())}
                </ListGroup.Item>
                <ListGroup.Item>
                  Withdrawn: {item.sent ? "True" : "False"}
                </ListGroup.Item>
              </ListGroup>
              <Card.Body className="text-center">
                <Button
                  onClick={() => {
                    if (!haveTimePast(item.end.toNumber())) {
                      console.log("Time lock is still active!");
                      return;
                    }

                    props.onWithdraw(item.id.toNumber() + 1);
                  }}
                  variant="primary"
                >
                  Withdraw
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
  );
}

export default WithdrawalCards;
