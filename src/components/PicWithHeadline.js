import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const PicWithHeadline = () => {
  return (
    <header className="py-5">
      <div className="container">
        <div className="row gx-4 gx-lg-5 align-items-center my-5">
          <div className="col-lg-7">
            <img
              className="img-fluid rounded mb-4 mb-lg-0"
              src="https://dummyimage.com/900x400/dee2e6/6c757d.jpg"
              alt="..."
            />
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-light">
              Stake BNB and Grow Your Altcoins!
            </h1>
            <p>
              Grow Your Altcoins By Staking BNBs into our Staking Pools. Redeem
              Your BNBs and get your BNBs back in a few days. BNB Charger
              collects a nominal one-time fee on BNB upon deposit. The other
              fees will be charged on the altcoins farmed when altcoin rewards
              are claimed.
            </p>
            <Link to="/deposit">
              <a className="btn btn-primary">Start Now!</a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PicWithHeadline;
