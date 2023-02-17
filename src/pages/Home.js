import { Fragment, useContext, useEffect, useState } from "react";
import UserContext from "../store/user-context";

import Jumbotron from "../components/layout/Jumbotron";
import Features from "../components/Features";

const Home = (props) => {
  const userCtx = useContext(UserContext);
  const { address, vault, provider, connectToBlockchain, saveReferrerId } =
    userCtx;

  const [entryFee, setEntryFee] = useState(undefined);
  const [farmingFee, setFarmingFee] = useState(undefined);

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
  }, [address, vault, provider, saveReferrerId]);

  return (
    <Fragment>
      <Jumbotron />
      <Features entryFee={entryFee} farmingFee={farmingFee} />
    </Fragment>
  );
};

export default Home;
