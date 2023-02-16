import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import UserContext from "../store/user-context";

import Header from "../components/layout/Header";
import Features from "../components/Features";

import { ethers } from "ethers";

import { useSearchParams } from "react-router-dom";
import UserMetrics from "../components/UserMetrics";
import { showToast } from "../lib/utils";

const Home = (props) => {
  const userCtx = useContext(UserContext);
  const {
    address,
    vault,
    provider,
    connectToMM,
    connectToBlockchain,
    resetMM,
    chainId,
    saveReferrerId,
  } = userCtx;

  const [acctData, setAcctData] = useState({});
  const [entryFee, setEntryFee] = useState(undefined);
  const [farmingFee, setFarmingFee] = useState(undefined);

  const [searchParams] = useSearchParams();
  let referrerInput = searchParams.get("referral");

  if (!referrerInput) {
    // console.log('no referrer found!');
    referrerInput = "0";
  } else {
    // console.log('referrer found! ', referrerInput);
  }

  const selectedChainId = ethers.BigNumber.from(chainId).toHexString(); // BNB chain test network

  const handleAcctChanged = useCallback(
    (accounts) => {
      console.log("accounts changed");
      setAcctData({});
      connectToMM();
    },
    [connectToMM]
  );

  const handleChainIdChanged = useCallback(
    (chainIdHex) => {
      console.log("chainId changed: ", chainIdHex);
      if (chainIdHex !== selectedChainId) {
        showToast("Please change to the selected network!", "warning");
        setAcctData({});
        resetMM();
      } else {
        connectToMM();
      }
    },
    [resetMM, connectToMM, selectedChainId]
  );

  useEffect(() => {
    const initReadOnly = async () => {
      connectToBlockchain();
    };
    initReadOnly();
  }, [connectToBlockchain]);

  useEffect(() => {
    const showFeesOnly = async () => {
      if (vault) {
        const feeEntry = await vault.entryFee();
        const feeFarming = await vault.farmingFee();
        setEntryFee(feeEntry);
        setFarmingFee(feeFarming);
      }
    };

    if (!address) {
      showFeesOnly();
      return;
    }
    const init = async () => {
      const userAccount = await vault.accounts(address);
      const stakeLength = await vault.addressToStakeArr(address);
      const accountData = {
        ...userAccount,
        stakeCount: stakeLength.length,
      };
      const feeEntry = await vault.entryFee();
      const feeFarming = await vault.farmingFee();

      setAcctData(accountData);
      saveReferrerId(referrerInput);
      setEntryFee(feeEntry);
      setFarmingFee(feeFarming);

      window.ethereum.on("accountsChanged", handleAcctChanged);
      window.ethereum.on("chainChanged", handleChainIdChanged);
    };
    init();
  }, [
    address,
    vault,
    provider,
    handleAcctChanged,
    handleChainIdChanged,
    saveReferrerId,
    referrerInput,
  ]);

  return (
    <Fragment>
      <Header />
      <Features entryFee={entryFee} farmingFee={farmingFee} />
      <UserMetrics acctData={acctData} />
    </Fragment>
  );
};

export default Home;
