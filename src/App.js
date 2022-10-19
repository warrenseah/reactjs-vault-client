import React, { Suspense, Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Spinner } from "react-bootstrap";

const Stakes = React.lazy(() => import("./pages/Stakes"));
const Rewards = React.lazy(() => import("./pages/Rewards"));
const NoPage = React.lazy(() => import("./pages/NoPage"));

const App = () => {
  return (
    <Fragment>
      <Suspense
        fallback={
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        }
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="stakes" element={<Stakes />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Suspense>
    </Fragment>
  );
};

export default App;
