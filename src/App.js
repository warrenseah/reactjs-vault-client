import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import Stakes from "./pages/Stakes";
import Rewards from "./pages/Rewards";
import NoPage from "./pages/NoPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="stakes" element={<Stakes />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path='*' element={<NoPage />} />
      </Route>
    </Routes>
  );
};

export default App;
