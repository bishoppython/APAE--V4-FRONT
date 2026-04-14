import Footer from "./components/footer";
import Header from "./components/header";
import { AppRouter } from "./router";
import "./index.css";

function App() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header />
      <AppRouter />
      <Footer nome="NeuroKids" ano={new Date().getFullYear()} />
    </div>
  );
}

export default App;