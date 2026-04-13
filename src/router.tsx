import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import { Necessities } from "./pages/necessities";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/necessities" element={<Necessities />} />
            </Routes>
        </BrowserRouter>
    );
}