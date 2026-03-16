import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Consumer from "./pages/Consumer";
import Store from "./pages/Store";
import Delivery from "./pages/Delivery";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/consumer" element={<Consumer />} />
        <Route path="/store" element={<Store />} />
        <Route path="/delivery" element={<Delivery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;