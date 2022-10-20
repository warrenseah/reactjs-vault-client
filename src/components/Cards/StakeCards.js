import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

import { ethers } from "ethers";
import { convertToDateTime } from "../../lib/utils";

function Cards(props) {
  let count = 0;

  return (
    <Row md={2} className="g-4">
      {props.items.map((item) => (
        <Col key={item.id.toString()}>
          <Card>
            <Card.Header>Stake Card {++count}</Card.Header>
            <Card.Body>
              <Card.Title>{`StakeId: ${item.id.toNumber() + 1}`}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                Amount: {ethers.utils.formatUnits(item.amountInTokens)} BNB
              </ListGroup.Item>
              <ListGroup.Item>
                {convertToDateTime(item.sinceTime.toString())}
              </ListGroup.Item>
            </ListGroup>
            <Card.Body className="text-center">
              <Button
                onClick={() => {
                  props.onUnstake(item.id.toNumber() + 1);
                }}
                variant="danger"
              >
                Unstake
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Cards;
