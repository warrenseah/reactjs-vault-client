const Features = (props) => {
  return (
    <section className="my-5">
      <div className="container px-5 my-5">
        <div className="row gx-5">
          <div className="col-lg-4 mb-5 mb-lg-0">
            <h2 className="fw-bolder mb-0">A better way to farm altcoins.</h2>
          </div>
          <div className="col-lg-8">
            <div className="row gx-5 row-cols-1 row-cols-md-2">
              <div className="col mb-5 h-100">
                <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3 col-sm-2 text-center">
                  <i
                    className="bi bi-collection"
                    style={{ fontSize: "1.8rem" }}
                  ></i>
                </div>

                <h2 className="h5">Stake BNB, Farm Many Altcoins</h2>
                <p className="mb-0">
                  Don't swap your BNB for altcoins. Using BNB Charger program,
                  you can use BNB to farm for multiple altcoins. When you have
                  participated enough, unstake and get your BNB back!
                </p>
              </div>
              <div className="col mb-5 h-100">
                <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3 col-sm-2 text-center">
                  <i
                    className="bi bi-building"
                    style={{ fontSize: "1.8rem" }}
                  ></i>
                </div>
                <h2 className="h5">Choose Farming, Don't Spend</h2>
                <p className="mb-0">
                  Don't swap your BNB for altcoins. Using BNB Charger program,
                  you can use BNB to farm for multiple altcoins. When you have
                  participated enough, unstake and get your BNB back!
                </p>
              </div>
              <div className="col mb-5 mb-md-0 h-100">
                <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3 col-sm-2 text-center">
                  <i
                    className="bi bi-brightness-alt-low"
                    style={{ fontSize: "1.8rem" }}
                  ></i>
                </div>
                <h2 className="h5">Low Entry Fees</h2>
                <p className="mb-0">
                  A one-time {`${props.entryFee}%`} fee charged upon deposit and
                  the deposited BNB can be used to participate in subsequent
                  launchpools / launchpads.
                </p>
              </div>
              <div className="col h-100">
                <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3 col-sm-2 text-center">
                  <i
                    className="bi bi-toggles2"
                    style={{ fontSize: "1.8rem" }}
                  ></i>
                </div>
                <h2 className="h5">Profit Sharing Based on Performance</h2>
                <p className="mb-0">
                  {`${props.farmingFee}%`} profit sharing fee on the total
                  amount of altcoins farmed and no other fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
