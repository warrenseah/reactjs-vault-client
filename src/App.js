import { Fragment, useRef, useState } from "react";
import { ethers } from "ethers";
import ContractMeta from "./contractMeta.json";

import { Row, Col, Button, Card, Form } from "react-bootstrap";
import Layout from "./components/layout/Layout";
import AlertModal from "./components/ui/AlertModal";
import Navigation from "./components/ui/Navigation";

const App = () => {
  // usetstate for storing and retrieving wallet details
  const [data, setData] = useState({
    address: "",
    balance: null,
  });
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [vault, setVault] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const ethInputRef = useRef();

  // Button handler button for handling a
  // request event for metamask
  const connectToMetamask = async () => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await newProvider.send("eth_requestAccounts", []);
      const balance = await newProvider.getBalance(accounts[0]);
      setData({
        address: accounts[0],
        balance: ethers.utils.formatEther(balance),
      });

      const newSigner = newProvider.getSigner();
      setProvider(newProvider);
      setSigner(newSigner);

      // instantiate contract abstraction
      const newVault = new ethers.Contract(
        ContractMeta.vaultAddress,
        ContractMeta.vaultAbi,
        newSigner
      );
      setVault(newVault);
    } else {
      alert("install metamask extension!!");
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEthAmt = ethInputRef.current.value;

    try {
      const depositTxn = await vault.deposit(0, {
        value: ethers.utils.parseEther(enteredEthAmt),
      });
      const txn = await depositTxn.wait();
      if (txn.status === 1) {
        handleShow();
        console.log("Deposit is successfully!");
      }
    } catch (error) {
      console.log("Deposit error, ", error);
    }
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <Fragment>
      <Navigation />
    <Layout>
      <Row>
        <Col>
          <Card>
            <Card.Header className="text-center">
              <strong>Address: </strong>
              {data.address}
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Balance: </strong>
                {data.balance}
              </Card.Text>
              {!signer && (
                <Button onClick={connectToMetamask} variant="primary">
                  Connect to wallet
                </Button>
              )}
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
                  <Button variant="primary" type="submit">
                    Deposit
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showModal && (
        <AlertModal
          title="Success!"
          body={`Your deposit of ${ethInputRef.current.value} ETH is successful!`}
          onShow={true}
          onHide={handleClose}
        />
      )}
    </Layout>
    </Fragment>
  );
};

export default App;
