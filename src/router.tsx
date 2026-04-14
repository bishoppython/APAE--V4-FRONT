import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/teste";
import { Necessities } from "./pages/necessities";
import { Numbers } from "./pages/numbers";
import Login from "@/pages/login";
import Labirinto from "@/pages/jogos/Labirinto";



export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/labirinto" element={<Labirinto />} />
                <Route path="/necessidades" element={<Necessities />} />
                <Route path="/numeros" element={<Numbers />} />
            </Routes>
        </BrowserRouter>
    );
}