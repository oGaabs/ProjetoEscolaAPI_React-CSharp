import "./App.css";

import Logo from "./components/template/Logo";
import Menu from "./components/template/Menu";
import Footer from "./components/template/Footer";

import Rotas from "./Rotas";
import { BrowserRouter } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Footer />
                <Logo />
                <Menu />
                <Rotas />
            </div>
        </BrowserRouter>
    );
}

export default App;
