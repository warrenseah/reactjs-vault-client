import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

import { ethers } from "ethers";
import { convertToDateTime, truncateTo2DC } from "../../lib/utils";
import { Fragment } from "react";

function YieldRewards(props) {
  const { items } = props;

  let count = 0;
  if (props.items.length === 0) {
    return <p>No reward found!</p>;
  }

  if (props.tokens.length === 0) {
    return <p>Still Loading...</p>;
  }

  const getMeta = (selectedAddress) => {
    const item = props.tokens.find(
      (token) => token.address === selectedAddress
    );
    // console.log(item);
    return item;
  };

  const unclaimedRewards = items.filter(
    (item) => item.claimAmt[1].toNumber() !== 0
  );
  const claimedRewards = items.filter(
    (item) => item.claimAmt[1].toNumber() === 0
  );

  const showExistingRewards = unclaimedRewards.length > 0 ? (
    unclaimedRewards.map((item, index) => (
      <Col key={item.stake.id.toString()}>
        <Card bg="success" text="white">
          <Card.Header>
            Reward Card {++count},{" "}
            {`YieldId: ${item.yield.id.toNumber() + 1}`}
          </Card.Header>
          <Card.Body>
            <Card.Title>
              Coin: {getMeta(item.yield.token).name}
            </Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item variant="success">
              Symbol: {getMeta(item.yield.token).symbol}
            </ListGroup.Item>
            <ListGroup.Item variant="success">
              Decimals: {getMeta(item.yield.token).decimals}
            </ListGroup.Item>
            <ListGroup.Item variant="success">
              Start: {convertToDateTime(item.yield.sinceTime.toString())}
            </ListGroup.Item>
            <ListGroup.Item variant="success">
              End: {convertToDateTime(item.yield.tillTime.toString())}
            </ListGroup.Item>
          </ListGroup>
          <Card.Body className="text-center">
            <Card.Text>
              Claim:{" "}
              {`${truncateTo2DC(
                ethers.utils.formatEther(item.claimAmt[1])
              )} ${getMeta(item.yield.token).symbol}`}{" "}
            </Card.Text>
            <Button
              onClick={() => {
                props.onClaim(
                  item.stake.id.toNumber() + 1,
                  item.yield.id.toNumber() + 1
                );
              }}
              variant="light"
            >
              Claim
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ))
  ) : (
    <p>No Unclaim Rewards!</p>
  );

  const showClaimedRewards = claimedRewards.length > 0 ? (
    claimedRewards.map((item, index) => (
      <Col key={item.stake.id.toString()}>
        <Card bg="secondary" text="white">
          <Card.Header>
            Reward Card {++count},{" "}
            {`YieldId: ${item.yield.id.toNumber() + 1}`}
          </Card.Header>
          <Card.Body>
            <Card.Title>
              Coin: {getMeta(item.yield.token).name}
            </Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>
              Symbol: {getMeta(item.yield.token).symbol}
            </ListGroup.Item>
            <ListGroup.Item>
              Decimals: {getMeta(item.yield.token).decimals}
            </ListGroup.Item>
            <ListGroup.Item>
              Start: {convertToDateTime(item.yield.sinceTime.toString())}
            </ListGroup.Item>
            <ListGroup.Item>
              End: {convertToDateTime(item.yield.tillTime.toString())}
            </ListGroup.Item>
          </ListGroup>
          <Card.Body className="text-center">
            <Card.Text>
              Claim:{" "}
              {`${truncateTo2DC(
                ethers.utils.formatEther(item.claimAmt[1])
              )} ${getMeta(item.yield.token).symbol}`}{" "}
            </Card.Text>
            <Button disabled variant="light">
              Claimed
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ))
  ) : (
    <p>No Claimed Rewards</p>
  );

  return (
    <Fragment>
      <Row md={2} className="g-4">
        {showExistingRewards}
      </Row>
      <h1>Claimed rewards</h1>
      <Row md={2} className="g-4">
        {showClaimedRewards}
      </Row>
    </Fragment>
  );
}

export default YieldRewards;
