import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import Stakes from "./pages/Stakes";
import Rewards from "./pages/Rewards";
import NoPage from "./pages/NoPage";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Fragment } from "react";

const App = () => {
  
  return (
    <Fragment>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="stakes" element={<Stakes />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path='*' element={<NoPage />} />
      </Route>
    </Routes>
    <ToastContainer />
    </Fragment>
  );
};

export default App;
