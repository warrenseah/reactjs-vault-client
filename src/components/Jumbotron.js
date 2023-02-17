import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Jumbotron = () => {
  return (
    <header className="py-5">
      <div className="container">
        <div className="p-4 p-lg-5 bg-light rounded-3 text-center">
          <div className="m-4 m-lg-5">
            <h1 className="display-5 fw-bold">
              Stake BNB and Grow Your Altcoins!
            </h1>
            <p className="fs-4">
              Grow Your Altcoins By Staking BNBs into our Staking Pools. Redeem
              Your BNBs and get your BNBs back in a few days. BNB Charger
              collects a nominal one-time fee on BNB upon deposit. The other
              fees will be charged on the altcoins farmed when altcoin rewards
              are claimed.
            </p>
            <Link to="/deposit">
              <Button variant="primary" size="lg">
                Start Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Jumbotron;
