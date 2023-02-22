import styles from "./FeeCounter.module.css";

const FeeCounter = (props) => {
  return (
    <div className={styles.container}>
      <div className="row">
        <div className="four col-md-3">
          <div className={`${styles.counter_box} ${styles.colored}`}>
            <i className="bi bi-hand-thumbs-up"></i>
            <span className={styles.counter}>2147</span>
            <p>Happy Customers</p>
          </div>
        </div>
        <div className="four col-md-3">
          <div className={styles.counter_box}>
            <i className="bi bi-people-fill"></i>
            <span className={styles.counter}>3275</span>
            <p>Registered Members</p>
          </div>
        </div>
        <div className="four col-md-3">
          <div className={`${styles.counter_box} ${styles.colored}`}>
            <i className="bi  bi-cart2"></i>
            <span className={styles.counter}>289</span>
            <p>Available Products</p>
          </div>
        </div>
        <div className="four col-md-3">
          <div className={styles.counter_box}>
            <i className="bi  bi-person-circle"></i>
            <span className={styles.counter}>1563</span>
            <p>Saved Trees</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeCounter;
