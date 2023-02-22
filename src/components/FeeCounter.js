import styles from "./FeeCounter.module.css";

const FeeCounter = ({ scData }) => {
  return (
    <div className={styles.container}>
      <div className="row">
        <div className="four col-md-3">
          <div className={`${styles.counter_box} ${styles.colored}`}>
            <i className="bi bi-hand-thumbs-up"></i>
            <span className={styles.counter}>
              {scData.totalStakes ? scData.totalStakes : undefined} Bnb
            </span>
            <p>Total Stakes</p>
          </div>
        </div>
        <div className="four col-md-3">
          <div className={styles.counter_box}>
            <i className="bi bi-people-fill"></i>
            <span className={styles.counter}>
              {scData.totalAccounts ? scData.totalAccounts : undefined}
            </span>
            <p>Members</p>
          </div>
        </div>
        <div className="four col-md-3">
          <div className={`${styles.counter_box} ${styles.colored}`}>
            <i className="bi  bi-sign-yield"></i>
            <span className={styles.counter}>
              {scData.totalYields ? scData.totalYields : undefined}
            </span>
            <p>Farmed Altcoins</p>
          </div>
        </div>
        <div className="four col-md-3">
          <div className={styles.counter_box}>
            <i className="bi  bi-mailbox2"></i>
            <span className={styles.counter}>
              {scData.totalWithdrawals ? scData.totalWithdrawals : undefined}
            </span>
            <p>Crypto Withdrawals</p>
          </div>
        </div>
      </div>
      <div className="row mt-4 d-flex justify-content-center">
        <div className="four col-md-3">
          <div className={`${styles.counter_box} ${styles.colored}`}>
            <i className="bi  bi-cash"></i>
            <span className={styles.counter}>
              {scData.entryFee ? scData.entryFee : undefined}%
            </span>
            <p>Admin Fee</p>
          </div>
        </div>
        <div className="four col-md-3">
          <div className={styles.counter_box}>
            <i className="bi  bi-receipt"></i>
            <span className={styles.counter}>
              {scData.farmingFee ? scData.farmingFee : undefined}%
            </span>
            <p>Farming Fee</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeCounter;
