import { useRef, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { showToast } from "../../lib/utils";

const CallToAction = (props) => {
  const emailInput = useRef();
  const nameInput = useRef();

  const [disableBtn, setDisableBtn] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const selectedEmail = emailInput.current.value;
    const selectedName = nameInput.current.value;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: selectedName, email: selectedEmail }),
    };
    const response = await fetch("/api/newsletter", requestOptions);
    const data = await response.json();
    console.log("frontend: ", data.data);
    if (data.data.id) {
      setDisableBtn(true);
      showToast(`User email (${selectedEmail}) is submitted!`, "success");
    }
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
            <form id="form1" onSubmit={submitHandler}>
              <div className="row justify-content-end">
                <div className="col-sm-4 mb-2">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="First Name"
                    ref={nameInput}
                    required
                  />
                </div>
                <div className="col-sm-5 mb-2">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email address..."
                    aria-label="Email address..."
                    aria-describedby="button-newsletter"
                    ref={emailInput}
                    required
                  />
                </div>
                <div className="col-sm-3">
                  <button
                    className="btn btn-secondary"
                    type="submit"
                    form="form1"
                    disabled={disableBtn}
                  >
                    {disableBtn ? "Done" : "Sign up"}
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="small text-white-50">
                    We care about privacy, and will never share your data.
                  </div>
                </div>
              </div>
            </form>
          </div>
        </aside>
      </Row>
    </Container>
  );
};

export default CallToAction;
