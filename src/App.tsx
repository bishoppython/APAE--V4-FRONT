import Footer from "./components/Footer";
import { AppRouter } from "./router";
import "./index.css";

function App() {
  return (
    <div className="text-3xl">
      <AppRouter />
      <Footer nome="NeuroKids" ano={new Date().getFullYear()} />
    </div>
  );
}

export default App;