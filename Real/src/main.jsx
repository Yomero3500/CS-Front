import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route,  } from "react-router-dom";
import App from './App.jsx'
import LayoutInicial from "./pages/LayoutInicial.jsx";
import AgregarUsuario from './pages/AgregarUsuario.jsx';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element= {<LayoutInicial/>}>
          <Route index element={<App/>}/>
          <Route path='agregarUsuario' element={<AgregarUsuario/>}/>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
)
