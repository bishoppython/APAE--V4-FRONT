import { AppRouter } from "./router";
import "./index.css";

function App() {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <AppRouter />
    </div>
  );
}

export default App;