import { Fragment, useContext, useEffect, useState, useCallback } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import UserContext from "../store/user-context";

import { ethers } from "ethers";
import { showToast } from "../lib/utils";

import UserMetrics from "../components/UserMetrics";

const Deposit = (props) => {
  const userCtx = useContext(UserContext);
  const {
    address,
    vault,
    provider,
    connectToMM,
    resetMM,
    chainId,
    saveReferrerId,
  } = userCtx;

  const [acctData, setAcctData] = useState({});

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
      saveReferrerId(referrerInput);

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
      <UserMetrics acctData={acctData} />
    </Fragment>
  );
};

export default Deposit;
