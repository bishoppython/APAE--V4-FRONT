import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Necessities } from "@/pages/necessities";
import { Numbers } from "@/pages/numbers";
import Header from "./components/header";
import { Test } from "@/pages/teste";
import { NotFound } from "./pages/not_found";
import Login from "@/pages/login";
import Labirinto from "@/pages/jogos/Labirinto";
import Home from "@/pages/home";
import Footer from "./components/footer";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/teste" element={<Test />} />
                <Route path="/login" element={<Login />} />
                <Route path="/labirinto" element={<Labirinto />} />
                <Route path="/necessidades" element={<Necessities />} />
                <Route path="/numeros" element={<Numbers />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer nome="NeuroKids" ano={new Date().getFullYear()} />
        </BrowserRouter>
    );
}