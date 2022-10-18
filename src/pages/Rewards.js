import { useCallback, useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Yields from "../components/Cards/YieldRewardCards";
import UserContext from "../store/user-context";
import { showToast } from "../lib/utils";

// const erc20ABI = [
//   // Read-Only Functions
//   "function decimals() view returns (uint8)",
//   "function name() view returns (string)",
//   "function symbol() view returns (string)",
//   "function totalSupply() view returns (uint256)",
// ];

const Rewards = () => {
  const userCtx = useContext(UserContext);
  const [yieldStakesArr, setYieldStakesArr] = useState([]);
  const { address, vault, signer } = userCtx;

  const getStakeArr = useCallback(async () => {
    const stakeArrIds = await vault.addressToStakeArr(address);

    const userStakeArr = [];

    for (let i = 0; i < stakeArrIds.length; i++) {
      const stake = await vault.stakes(stakeArrIds[i] - 1);
      userStakeArr.push(stake);
    }

    return userStakeArr;
  }, [address, vault]);

  const init = useCallback(async () => {
    if (!vault) {
      return;
    }

    const endingYields = await vault.getEndedYield(); // need to minus 1
    const yields = [];

    for (let i = 0; i < endingYields.length; i++) {
      const item = await vault.yields(endingYields[i].toNumber() - 1);
      yields.push(item);
    }
    const stakeArr = await getStakeArr();
    
    const eligibleStakes = [];
    // Check if user stake cards exists before yield commence
    for (let j = 0; j < yields.length; j++) {
      const yieldSinceTime = yields[j].sinceTime.toNumber();

      // iterate with all available stake cards
      for (let z = 0; z < stakeArr.length; z++) {
        const stakeSinceTime = stakeArr[z].sinceTime.toNumber();
        if (stakeSinceTime < yieldSinceTime) {
          // Find claim amount for eligible stakes
          const claims = await vault.getClaimsFor(
            stakeArr[z].id.toNumber() + 1,
            yields[j].id.toNumber() + 1
          );
          eligibleStakes.push({
            yield: yields[j],
            stake: stakeArr[z],
            claimAmt: claims,
          });
        }
      }
    }
    setYieldStakesArr(eligibleStakes);
  },[vault, getStakeArr]);

  useEffect(() => {
    init();
  }, [address, vault, signer, init]);

  if (!userCtx.address) {
    return <Navigate to="/" replace />;
  }

  const claimHandler = async (stakeId, yieldId) => {
    try {
      const txn = await vault.claimYieldTokens(stakeId, yieldId);
      const receipt = await txn.wait();
      if (receipt.status === 1) {
        console.log(
          `Claim is successful for ${stakeId} with ${yieldId} reward card!`
        );
        showToast(`Claim is successful for ${stakeId} with ${yieldId} reward card!`, 'success');
        await init();
      } else {
        throw new Error("Claim failed!");
      }
    } catch (error) {
      console.log(error);
      showToast(`Claim failed!`, 'error');
    }
  };

  return (
    <Container>
      <Row>
        <Col className="my-3">
          <h1>This is Rewards Page</h1>
        </Col>
      </Row>
      <Yields items={yieldStakesArr} onClaim={claimHandler} />
    </Container>
  );
};

export default Rewards;
