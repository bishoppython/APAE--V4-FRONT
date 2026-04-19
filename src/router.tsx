import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Necessities } from "@/pages/conversacao/necessities";
import { Numbers } from "@/pages/conversacao/numbers";
import Header from "./components/header";
import { Test } from "@/pages/teste";
import { NotFound } from "./pages/not_found";
import Login from "@/pages/login";

//Jogos
import Labirinto from "@/pages/jogos/Labirinto";
import Soletrando from "@/pages/jogos/Soletrando";
import Memoria from "@/pages/jogos/Memoria";

import Home from "@/pages/home";
import Footer from "./components/footer";
import ChildLogin from "./pages/child_login";
import { ColorMixer } from "./pages/conversation/color_mixer";
import Memoria from "./pages/jogos/Memoria";
import { Colors } from "./pages/conversation/colors";
import { Animals } from "./pages/conversation/animals";
import { ColorMixer } from "./pages/conversacao/color_mixer";

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
                    <Route path="/calculadora" element={<Numbers />} />
                    <Route path="/animais" element={<Animals />} />
                    <Route path="/misturando-cores" element={<ColorMixer />} />

                    {/* Jogos */}
                    <Route path="/labirinto" element={<Labirinto />} />
                    <Route path="/soletrando" element={<Soletrando />} />
                    <Route path="/memoria" element={<Memoria />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/login-crianca" element={<ChildLogin />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}