import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import Labirinto from "./pages/jogos/Labirinto";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/labirinto" element={<Labirinto />} />
            </Routes>
        </BrowserRouter>
    );
}