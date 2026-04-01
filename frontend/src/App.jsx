import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Funcionarios from "./pages/Funcionarios";
import Cargos from "./pages/Cargos";
import Departamentos from "./pages/Departamentos";
import FolhasDePagamento from "./pages/FolhasDePagamento";
import Lancamentos from "./pages/Lancamentos";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/cargos" element={<Cargos />} />
          <Route path="/departamentos" element={<Departamentos />} />
          <Route path="/folhas" element={<FolhasDePagamento />} />
          <Route path="/lancamentos" element={<Lancamentos />} />
          <Route path="/" element={<Funcionarios />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
