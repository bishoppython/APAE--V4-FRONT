import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";

import { NotFound } from "./pages/not_found";
import ChildLogin from "./pages/child_login";
import { Test } from "@/pages/teste";
import Login from "@/pages/login";
import Home from "@/pages/home";

import { Necessities } from "@/pages/conversation/necessities";
import { ColorMixer } from "@/pages/conversation/color_mixer";
import { Numbers } from "@/pages/conversation/numbers";
import { Calculator } from "@/pages/conversation/calculator";
import { Animals } from "@/pages/conversation/animals";
import { Colors } from "@/pages/conversation/colors";

import Soletrando from "@/pages/games/Soletrando";
import Labirinto from "@/pages/games/Labirinto";
import Memoria from "@/pages/games/Memoria";
import AdivinhaAnimais from "./pages/games/AdivinhaAnimais";
import EncaixeFormas from "./pages/games/EncaixeFormas";
import CobrirTracejado from "./pages/games/CobrirTracejado";
import QuebraCabeca from "./pages/games/QuebraCabeca";

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
                    {/* Menus */}
                    <Route path="/" element={<Home />} />
                    <Route path="/teste" element={<Test />} />

                    {/* Conversação */}
                    <Route path="/necessidades" element={<Necessities />} />
                    <Route path="/cores" element={<Colors />} />
                    <Route path="/numeros" element={<Numbers />} />
                    <Route path="/calculadora" element={<Calculator />} />
                    <Route path="/animais" element={<Animals />} />
                    <Route path="/misturando-cores" element={<ColorMixer />} />

                    {/* Jogos */}
                    <Route path="/onde-esta" element={<AdivinhaAnimais />} />
                    <Route path="/labirinto" element={<Labirinto />} />
                    <Route path="/soletrando" element={<Soletrando />} />
                    <Route path="/memoria" element={<Memoria />} />
                    <Route path="/encaixe-formas" element={<EncaixeFormas />} />
                    <Route path="/cobrir-tracejado" element={<CobrirTracejado />} />
                    <Route path="/quebra-cabeca" element={<QuebraCabeca />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/login-crianca" element={<ChildLogin />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}