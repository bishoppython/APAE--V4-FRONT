import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";

const NotFound = lazy(() => import("./pages/not_found").then(module => ({ default: module.NotFound })));
const ChildLogin = lazy(() => import("./pages/child_login"));
const Test = lazy(() => import("@/pages/teste").then(module => ({ default: module.Test })));
const Login = lazy(() => import("@/pages/login"));
const Home = lazy(() => import("@/pages/home"));

const Necessities = lazy(() => import("@/pages/conversation/necessities").then(module => ({ default: module.Necessities })));
const ColorMixer = lazy(() => import("@/pages/conversation/color_mixer").then(module => ({ default: module.ColorMixer })));
const Numbers = lazy(() => import("@/pages/conversation/numbers").then(module => ({ default: module.Numbers })));
const Calculator = lazy(() => import("@/pages/conversation/calculator").then(module => ({ default: module.Calculator })));
const Animals = lazy(() => import("@/pages/conversation/animals").then(module => ({ default: module.Animals })));
const Colors = lazy(() => import("@/pages/conversation/colors").then(module => ({ default: module.Colors })));

const Soletrando = lazy(() => import("@/pages/games/Soletrando"));
const Labirinto = lazy(() => import("@/pages/games/Labirinto"));
const Memoria = lazy(() => import("@/pages/games/Memoria"));
const AdivinhaAnimais = lazy(() => import("./pages/games/AdivinhaAnimais"));
const EncaixeFormas = lazy(() => import("./pages/games/EncaixeFormas"));
const CobrirTracejado = lazy(() => import("./pages/games/CobrirTracejado"));
const QuebraCabeca = lazy(() => import("./pages/games/QuebraCabeca"));

function MainLayout() {
    return (
        <>
            <Header />
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                </div>
            }>
                <Outlet />
            </Suspense>
            <Footer name="NeuroKids" year={new Date().getFullYear()} />
        </>
    );
}

export function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                </div>
            }>
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
            </Suspense>
        </BrowserRouter>
    );
}