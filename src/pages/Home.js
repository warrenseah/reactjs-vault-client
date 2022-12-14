import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
import { convertToDateTime, showToast } from "../lib/utils";

const selectedChainId = ethers.BigNumber.from(1337).toHexString(); // hardhat node test network

const Home = (props) => {
  const userCtx = useContext(UserContext);
  const { address, balance, vault, provider, connectToMM, resetMM, signer } =
    userCtx;

  const [showSpinner, setShowSpinner] = useState(false);
  const [showSpinnerConnect, setShowSpinnerConnect] = useState(false);
  const [acctData, setAcctData] = useState({});

  const ethInputRef = useRef();
  const navigate = useNavigate();

  const handleAcctChanged = useCallback(
    (accounts) => {
      console.log("accounts changed");
      setAcctData({});
      connectToMM();
    },
    [connectToMM]
  );

  const handleChainIdChanged = useCallback(
    (chainId) => {
      console.log("chainId changed: ", chainId);
      if (chainId !== selectedChainId) {
        showToast("Please change to the selected network!", 'warning');
        setAcctData({});
        resetMM();
      } else {
        connectToMM();
      }
    },
    [resetMM, connectToMM]
  );

  useEffect(() => {
    if (!address || !provider) {
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
      window.ethereum.on("accountsChanged", handleAcctChanged);
      window.ethereum.on("chainChanged", handleChainIdChanged);
    };
    init();
  }, [address, vault, provider, handleAcctChanged, handleChainIdChanged]);

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
        showToast(`${enteredEthAmt} BNB submitted!`, 'success');
        navigate("stakes");
      }
    } catch (error) {
      setShowSpinner(false);
      console.log("Deposit error, ", error);
      showToast(`Deposit Error! Please try again!`, 'error');
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

  const showConnectOrSpinner = !showSpinnerConnect ? (
    <Button
      onClick={() => {
        setShowSpinnerConnect(true);
        connectToMM();
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
            <ListGroup.Item>AccountId: {acctData.id.toString()}</ListGroup.Item>
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
  ) : (
    ""
  );

  return (
    <Container>
      <Row>
        <Col>
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

      {address && showProfile}
    </Container>
  );
};

export default Home;
