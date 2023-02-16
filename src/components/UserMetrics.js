import { useContext, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import UserContext from "../store/user-context";
import { ethers } from "ethers";

import { useNavigate } from "react-router-dom";
import { convertToDateTime, showToast } from "../lib/utils";

const UserMetrics = ({ acctData }) => {
  const userCtx = useContext(UserContext);
  const { address, balance, vault, connectToMM, signer, referrer } = userCtx;

  const navigate = useNavigate();

  const [showSpinner, setShowSpinner] = useState(false);
  const [showSpinnerConnect, setShowSpinnerConnect] = useState(false);

  const ethInputRef = useRef();

  const closeSpinnerHandler = () => {
    setShowSpinnerConnect(false);
  };

  const showConnectOrSpinner = !showSpinnerConnect ? (
    <Button
      id="connectToWallet"
      onClick={() => {
        setShowSpinnerConnect(true);
        connectToMM(closeSpinnerHandler);
      }}
      variant="primary"
    >
      Connect to wallet
    </Button>
  ) : (
    <Button variant="secondary" disabled>
      <Spinner
        as="span"
        animation="border"
        size="md"
        role="status"
        aria-hidden="true"
      />
    </Button>
  );

  const showBtnOrSpinner = !showSpinner ? (
    <Button variant="primary" type="submit">
      Deposit
    </Button>
  ) : (
    <Button variant="secondary" disabled>
      <Spinner
        as="span"
        animation="border"
        size="md"
        role="status"
        aria-hidden="true"
      />
    </Button>
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    setShowSpinner(true);
    const enteredEthAmt = ethInputRef.current.value;

    try {
      console.log("depositing...", referrer);
      const depositTxn = await vault.deposit(referrer, {
        value: ethers.utils.parseEther(enteredEthAmt),
      });
      const txn = await depositTxn.wait();
      if (txn.status === 1) {
        setShowSpinner(false);
        userCtx.saveUserBalance();
        console.log("Deposit is successfully!");
        showToast(`${enteredEthAmt} BNB submitted!`, "success");
        navigate("stakes");
      }
    } catch (error) {
      setShowSpinner(false);
      console.log("Deposit error, ", error);
      showToast(`Deposit Error! Please try again!`, "error");
    }
  };

  const showProfile = acctData.haveStakes ? (
    <Col lg={6} className="my-3">
      <Card>
        <Card.Header className="text-center">
          <strong>User Profile </strong>
        </Card.Header>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>
            <strong> Total Stakes: {acctData.stakeCount}</strong>
          </ListGroup.Item>
          <ListGroup.Item>AccountId: {acctData.id.toString()}</ListGroup.Item>
          <ListGroup.Item>
            ReferredCount: {acctData.referredCount.toString()}
          </ListGroup.Item>
          <ListGroup.Item>
            Referral URL:{" "}
            {`${
              process.env.REACT_APP_DOMAIN_URL
            }?referral=${acctData.id.toString()}`}
          </ListGroup.Item>
          <ListGroup.Item>
            Last Active:{" "}
            {convertToDateTime(acctData.lastActiveTimestamp.toNumber())}
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Col>
  ) : (
    ""
  );

  return (
    <Container>
      <Row className="justify-content-lg-center">
        <Col lg={6} className="my-3">
          <Card>
            <Card.Header className="text-center">
              <strong>Address: </strong>
              {address}
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Balance: </strong>
                {balance}
              </Card.Text>

              {!signer && showConnectOrSpinner}

              {signer && (
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="formBasicDeposit">
                    <Form.Label>Deposit Ether</Form.Label>
                    <Form.Control
                      type="number"
                      min="0.01"
                      step="0.01"
                      ref={ethInputRef}
                    />
                  </Form.Group>
                  {showBtnOrSpinner}
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
        {address && showProfile}
      </Row>
    </Container>
  );
};

export default UserMetrics;
