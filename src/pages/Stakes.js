import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import StakeCards from "../components/Cards/StakeCards";
import WithdrawalCards from "../components/Cards/WithdrawalCards";
import UserContext from "../store/user-context";
import { showToast } from "../lib/utils";

const Stakes = () => {
  const userCtx = useContext(UserContext);
  const { address, vault } = userCtx;
  const [stakeArr, setStakeArr] = useState([]);
  const [withdrawArr, setWithdrawArr] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);

  const getStakeWithdrawArr = useCallback(async () => {
    const stakeArrIds = await vault.addressToStakeArr(address);
    const withdrawArrIds = await vault.addressToWithdrawArr(address);

    let userStakeArr = [];
    let userWithdrawArr = [];

    for (let i = 0; i < stakeArrIds.length; i++) {
      const stake = await vault.stakes(stakeArrIds[i] - 1);
      userStakeArr.push(stake);
    }

    setStakeArr(userStakeArr);

    for (let j = 0; j < withdrawArrIds.length; j++) {
      const stake = await vault.withdrawals(withdrawArrIds[j] - 1);
      userWithdrawArr.push(stake);
    }
    setWithdrawArr(userWithdrawArr);
    setShowSpinner(false);
  }, [address, vault]);

  useEffect(() => {
    if (!vault) {
      return;
    }
    getStakeWithdrawArr();
  }, [address, vault, getStakeWithdrawArr]);

  const unstakeClickHandler = async (stakeId) => {
    setShowSpinner(true);
    try {
      const txn = await vault.submitWithdrawal(stakeId);
      const receipt = await txn.wait();
      if (receipt.status === 1) {
        console.log("Submit Withdrawal is Successful!");
        await getStakeWithdrawArr();
        showToast('Withdrawal Submitted!', 'info');
      } else {
        throw new Error("Submit withdrawal failed!");
      }
    } catch (error) {
      console.log("Error: ", error.message);
      setShowSpinner(false);
      showToast('Withdrawal Failed!', 'error');
    }
  };

  const withdrawClickHandler = async (withdrawId) => {
    setShowSpinner(true);
    try {
      const txn = await vault.withdraw(withdrawId);
      const receipt = await txn.wait();
      if (receipt.status === 1) {
        console.log("Funds are Successfully Withdrawn!");
        await getStakeWithdrawArr();
        showToast('Funds are Successfully Withdrawn!', 'success');
      } else {
        setShowSpinner(false);
        throw new Error("Withdrawal failed!");
      }
    } catch (error) {
      console.log("Error: ", error.message);
      setShowSpinner(false);
      showToast('Withdrawal Failed!', 'error');
    }
  };

  // Redirect if not connected to Metamask or vault contract is not defined
  if (!address || !vault) {
    return <Navigate to="/" replace />;
  }

  return (
    <Fragment>
      {showSpinner ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : null}
      <Container>
        <Row className="my-3">
          <Col>
            <h1>Stakes</h1>
          </Col>
          {stakeArr.length > 0 ? (
            <StakeCards items={stakeArr} onUnstake={unstakeClickHandler} />
          ) : (
            <p>No Stake.</p>
          )}
        </Row>
        <Row>
          <Col className="my-3">
            <h1>Pending Withdrawals</h1>
          </Col>
          {withdrawArr.length > 0 ? (
            <WithdrawalCards
              items={withdrawArr}
              onWithdraw={withdrawClickHandler}
            />
          ) : (
            <p>No Pending Withdrawal.</p>
          )}
        </Row>
      </Container>
    </Fragment>
  );
};

export default Stakes;
