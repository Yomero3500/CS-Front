import '../styles/inicio.style.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";

function ToolbarExample() {
    const navegar = useNavigate();

    const entrar= async()=>{
        navegar("/unirse")
    }

    const crear= async()=>{
        navegar("/crear")
    }
  return (
    <div className='containerGlobaSesion' >

      <div style={{marginTop:"20%", marginLeft:"44%"}}>
      <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups" >
        <ButtonGroup className="me-2" aria-label="First group">
          <Button variant="primary" onClick={crear}>Crear una partida</Button>
        </ButtonGroup>
      </ButtonToolbar>

      <ButtonToolbar
        className="justify-content-between"
        aria-label="Toolbar with Button groups"
      >
        <ButtonGroup aria-label="First group">
          <Button variant="primary" onClick={entrar}>Entrar a una partida</Button>
        </ButtonGroup>
      </ButtonToolbar>
      </div>
    </div>
  );
}

export default ToolbarExample;