import { useCallback, useContext, useEffect, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import { Navigate } from "react-router-dom";
import Yields from "../components/Cards/YieldRewardCards";
import UserContext from "../store/user-context";
import { showToast } from "../lib/utils";
import { ethers } from "ethers";

const erc20ABI = [
  // Read-Only Functions
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
];

const Rewards = () => {
  const userCtx = useContext(UserContext);
  const [yieldStakesArr, setYieldStakesArr] = useState([]);
  const { address, vault, signer, provider } = userCtx;
  const [showSpinner, setShowSpinner] = useState(true);
  const [tokenMeta, setTokenMeta] = useState([]);

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
    const getErc20Meta = async (tokenAddress) => {
      const erc20 = new ethers.Contract(tokenAddress, erc20ABI, provider);
      const name = await erc20.name();
      const symbol = await erc20.symbol();
      const decimals = await erc20.decimals();
      setTokenMeta((prev) => [
        ...prev,
        { address: tokenAddress, name, symbol, decimals },
      ]);
    };

    const endingYields = await vault.getEndedYield(); // need to minus 1
    const yields = [];

    for (let i = 0; i < endingYields.length; i++) {
      if (endingYields[i].toNumber() !== 0) {
        const item = await vault.yields(endingYields[i].toNumber() - 1);
        yields.push(item);
      }
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

    for (let i = 0; i < eligibleStakes.length; i++) {
      getErc20Meta(eligibleStakes[i]["yield"]["token"]);
    }

    // console.log("In Rewards...");
    // console.log(eligibleStakes);
    setYieldStakesArr(eligibleStakes);
    setShowSpinner(false);
  }, [vault, getStakeArr, provider]);

  useEffect(() => {
    if (!address) {
      return;
    }

    init();
    const filterClaimFrom = vault.filters.ClaimedTokens(
      null,
      null,
      null,
      address,
      null
    );
    vault.on(
      filterClaimFrom,
      (yieldId, stakeId, token, user, amount, event) => {
        const txnObj = {
          yieldId: yieldId.toNumber(),
          stakeId: stakeId.toNumber(),
          token,
          user,
          amount: ethers.utils.formatEther(amount.toString()),
          event,
        };

        // console.log(txnObj);
        showToast(
          `stakeId: ${txnObj.stakeId + 1} claimed ${
            txnObj.amount
          } tokens. txnHash: ${txnObj.event.transactionHash}`,
          "info"
        );
      }
    );

    // remove eventListener on unmounting
    return () => {
      // console.log("eventListener is removed!");
      vault.removeAllListeners();
    };
  }, [address, vault, signer, init, provider]);

  if (!userCtx.address) {
    return <Navigate to="/" replace />;
  }

  const claimHandler = async (stakeId, yieldId) => {
    try {
      setShowSpinner(true);
      const txn = await vault.claimYieldTokens(stakeId, yieldId);
      const receipt = await txn.wait();
      if (receipt.status === 1) {
        console.log(
          `Claim success! for ${stakeId} with ${yieldId} reward card!`
        );
        showToast(`Claim success!`, "success");
        await init();
      } else {
        throw new Error("Claim failed!");
      }
    } catch (error) {
      console.log(error);
      setShowSpinner(false);
      showToast(`Claim failed!`, "error");
    }
  };

  // console.log(tokenMeta);
  return (
    <Container>
      <Row>
        <Col className="my-3">
          <h1>This is Rewards Page</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {showSpinner ? (
            <Spinner animation="border" role="status" className="my-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : null}
        </Col>
      </Row>
      <Yields
        items={yieldStakesArr}
        tokens={tokenMeta}
        onClaim={claimHandler}
      />
    </Container>
  );
};

export default Rewards;
