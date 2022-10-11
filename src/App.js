import { useContext, useRef, useState } from "react";
import { ethers } from "ethers";

import { Row, Col, Button, Card, Form } from "react-bootstrap";
import Layout from "./components/layout/Layout";
import AlertModal from "./components/ui/AlertModal";
import UserContext from "./store/user-context";

const App = () => {
  const userCtx = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  const ethInputRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEthAmt = ethInputRef.current.value;

    try {
      const depositTxn = await userCtx.vault.deposit(0, {
        value: ethers.utils.parseEther(enteredEthAmt),
      });
      const txn = await depositTxn.wait();
      if (txn.status === 1) {
        handleShow();
        userCtx.saveUserBalance();
        console.log("Deposit is successfully!");
      }
    } catch (error) {
      console.log("Deposit error, ", error);
    }
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (      
    <Layout>
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
          onShow={showModal}
          onHide={handleClose}
        />
      )}
    </Layout>
  );
};

export default App;
