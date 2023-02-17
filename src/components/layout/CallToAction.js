import { useRef } from "react";
import { Container, Row } from "react-bootstrap";
import { showToast } from "../../lib/utils";

const CallToAction = (props) => {
  const emailInput = useRef();
  const submitHandler = (e) => {
    e.preventDefault();
    const selectedEmail = emailInput.current.value;
    showToast(`User email (${selectedEmail}) is submitted!`, "success");
  };

  return (
    <Container>
      <Row className="justify-content-lg-center">
        <aside className="col-lg-10 bg-primary bg-gradient rounded-3 p-4 p-sm-5 mt-5">
          <div className="d-flex align-items-center justify-content-between flex-column flex-xl-row text-center text-xl-start">
            <div className="mb-4 mb-xl-0">
              <div className="fs-3 fw-bold text-white">
                News update, delivered to you.
              </div>
              <div className="text-white-50">
                Sign up for our newsletter for the latest updates.
              </div>
            </div>
            <div className="ms-xl-4">
              <div className="input-group mb-2">
                <form id="form1" onSubmit={submitHandler}>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email address..."
                    aria-label="Email address..."
                    aria-describedby="button-newsletter"
                    ref={emailInput}
                  />
                </form>
                <button
                  className="btn btn-secondary"
                  type="submit"
                  form="form1"
                >
                  Sign up
                </button>
              </div>
              <div className="small text-white-50">
                We care about privacy, and will never share your data.
              </div>
            </div>
          </div>
        </aside>
      </Row>
    </Container>
  );
};

export default CallToAction;
