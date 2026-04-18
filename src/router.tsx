import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Necessities } from "@/pages/necessities";
import { Numbers } from "@/pages/numbers";
import Header from "./components/header";
import { Test } from "@/pages/teste";
import { NotFound } from "./pages/not_found";
import Login from "@/pages/login";

//Jogos
import Labirinto from "@/pages/jogos/Labirinto";
import Soletrando from "@/pages/jogos/Soletrando";

import Home from "@/pages/home";
import Footer from "./components/footer";
import ChildLogin from "./pages/child_login";
import { ColorMixer } from "./pages/color_mixer";

function MainLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer name="NeuroKids" year={new Date().getFullYear()} />
        </>
    );
}

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/teste" element={<Test />} />
                    <Route path="/labirinto" element={<Labirinto />} />
                    <Route path="/soletrando" element={<Soletrando />} />
                    <Route path="/necessidades" element={<Necessities />} />
                    <Route path="/numeros" element={<Numbers />} />
                    <Route path="/misturando-cores" element={<ColorMixer />} />
                    <Route path="/memoria" element={<Memoria />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/login-crianca" element={<ChildLogin />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}