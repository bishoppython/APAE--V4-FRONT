import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import { Necessities } from "./pages/necessities";
import { Numbers } from "./pages/numbers";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/necessities" element={<Necessities />} />
                <Route path="/numbers" element={<Numbers />} />
            </Routes>
        </BrowserRouter>
    );
}