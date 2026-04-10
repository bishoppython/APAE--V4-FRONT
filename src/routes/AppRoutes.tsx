import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Labirinto from "../pages/jogos/Labirinto";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/labirinto" element={<Labirinto />} />
      </Routes>
    </BrowserRouter>
  );
}
