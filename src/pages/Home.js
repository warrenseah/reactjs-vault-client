import { Fragment, useContext, useEffect } from "react";
import UserContext from "../store/user-context";

import Jumbotron from "../components/Jumbotron";
import Features from "../components/Features";
import FeeCounter from "../components/FeeCounter";

const Home = (props) => {
  const userCtx = useContext(UserContext);
  const { connectToBlockchain, scData } = userCtx;

  useEffect(() => {
    const initReadOnly = async () => {
      connectToBlockchain();
    };
    initReadOnly();
  }, [connectToBlockchain]);

  return (
    <Fragment>
      <Jumbotron />
      <Features entryFee={scData.entryFee} farmingFee={scData.farmingFee} />
      <FeeCounter scData={scData} />
    </Fragment>
  );
};

export default Home;
