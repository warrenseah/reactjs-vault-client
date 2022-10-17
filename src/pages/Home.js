import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../store/user-context";

import { ethers } from "ethers";

import {
  Row,
  Col,
  Button,
  Card,
  Form,
  Container,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { convertToDateTime } from "../lib/utils";

const Home = (props) => {
  const userCtx = useContext(UserContext);
  const { address, vault } = userCtx;

  const [showSpinner, setShowSpinner] = useState(false);
  const [acctData, setAcctData] = useState({});

  const ethInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      return;
    }

    const init = async () => {
      const userAccount = await vault.accounts(address);
      const stakeLength = await vault.addressToStakeArr(address);
      const accountData = {
        ...userAccount,
        stakeCount: stakeLength.length,
      };
      setAcctData(accountData);
    };
    init();
  }, [address, vault]);

  const submitHandler = async (event) => {
    event.preventDefault();
    setShowSpinner(true);
    const enteredEthAmt = ethInputRef.current.value;

    try {
      const depositTxn = await userCtx.vault.deposit(0, {
        value: ethers.utils.parseEther(enteredEthAmt),
      });
      const txn = await depositTxn.wait();
      if (txn.status === 1) {
        setShowSpinner(false);
        userCtx.saveUserBalance();
        console.log("Deposit is successfully!");
        navigate("stakes");
      }
    } catch (error) {
      setShowSpinner(false);
      console.log("Deposit error, ", error);
    }
  };

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

  const showProfile = acctData.haveStakes ? (
    <Row className="my-3">
      <Col>
        <Card>
          <Card.Header className="text-center">
            <strong>User Profile </strong>
          </Card.Header>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>
              <strong> Total Stakes: {acctData.stakeCount}</strong>
            </ListGroup.Item>
            <ListGroup.Item>
              AccountId: {acctData.id.toString()}
            </ListGroup.Item>
            <ListGroup.Item>
              ReferredCount: {acctData.referredCount.toString()}
            </ListGroup.Item>
            <ListGroup.Item>
              Last Active:{" "}
              {convertToDateTime(acctData.lastActiveTimestamp.toNumber())}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  ) : '' ;

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header className="text-center">
              <strong>Address: </strong>
              {userCtx.address}
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Balance: </strong>
                {userCtx.balance}
              </Card.Text>
              {!userCtx.signer && (
                <Button onClick={userCtx.connectToMM} variant="primary">
                  Connect to wallet
                </Button>
              )}
              {userCtx.signer && (
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="formBasicDeposit">
                    <Form.Label>Deposit Ether</Form.Label>
                    <Form.Control
                      type="number"
                      min="0.1"
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
      </Row>

      {acctData.haveStakes && showProfile}

    </Container>
  );
};

export default Home;
