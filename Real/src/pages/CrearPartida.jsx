import Table from "react-bootstrap/Table";
import { React, useState, useEffect } from "react";
import "../styles/inicio.style.css";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import io from 'socket.io-client';

const apiUrl = "http://localhost:3000";
const socket = io(apiUrl);

function CrearPartida() {
  const [palabraSecreta, setPalabraSecreta] = useState("");
  const [palabraAdivinada, setPalabraAdivinada] = useState([]);
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [historialLetras, setHistorialLetras] = useState([]);
  const [partida, setPartida] = useState("");
  const [letry, setLetry] = useState("");
  const [useEffectFlag, setUseEffectFlag] = useState(false)
 
 
  const letra = async (e) =>{
    e.preventDefault();
    const letraMinuscula = letry.toLowerCase();

    if (historialLetras.includes(letraMinuscula)) {
      alert('Ya has seleccionado esta letra. Intenta con otra.');

      return;
    }

    setHistorialLetras([...historialLetras, letraMinuscula]);

    if (palabraSecreta.includes(letraMinuscula)) {
      const nuevaPalabraAdivinada = palabraAdivinada.map((letra, index) =>
        palabraSecreta[index] === letraMinuscula ? true : letra
      );
      setPalabraAdivinada(nuevaPalabraAdivinada);

      const id_partida = partida;
      console.log(id_partida);

      try {
        await axios.put("http://localhost:3000/match/letra", {
          id_partida:id_partida,
          letra: letraMinuscula
        });
      } catch (error) {
        console.error("Error al enviar la letra");
        console.error(error);
      }
    } else {
      setIntentosRestantes(intentosRestantes - 1);
      if (intentosRestantes==0) {
        await axios.put("http://localhost:3000/match/partida",{
            id_partida: partida,
            estado: "Finalizado"
        });
        Swal.fire({
          icon: "error",
          title: "...Ooops",
          text: "No se ha adivinado la palabra en los intentos requeridos"
        })
      }
    }
  }

  const fetchPalabra = async () => {
    const palabras = ['javascript', 'react', 'node', 'developer'];
    const palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
    setPalabraSecreta(palabraAleatoria.toLowerCase());
    const palabra = palabraAleatoria.toLowerCase();
    const id_participante1 = 1;
    const id_participante2 = 2;
    const id_participante3 = 3;
    setPalabraAdivinada(new Array(palabraAleatoria.length).fill(false));

    try {
      const response = await axios.post("http://localhost:3000/match/add", {
        palabra,
        id_participante1,
        id_participante2,
        id_participante3
      });

      console.log("La partida se ha creado correctamente");
      console.log(response.data.id_partida);
      setPartida(response.data.id_partida);
      
      socket.emit('crearPartida', partida);
      
      Swal.fire({
        icon: "success",
        title: "Easy",
        text: "Bienvenido su palabra es..."
      });
    } catch (error) {
      console.error("Error al crear la partida");
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "...Ooops",
        text: "Ha ocurrido un problema para obtener una palabra "
      });
    }
  };

  useEffect(() => {
    if (useEffectFlag==false) {
      fetchPalabra();
      setUseEffectFlag(true)
    }

    return () => {
      socket.off('mensaje');
    };
  }, []); 
  

  
  const mostrarPalabraAdivinada = () => {
      return palabraAdivinada.map((letra, index) => (letra ? palabraSecreta[index] : '_')).join(' ');
    };

  return (
    <Container>
      <Row>
        <Col>
          <div className="containerGlobaSesion">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th colSpan={3}>Juego del Ahorcado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3}>ID del juego: {partida}</td>
                </tr>
                <tr>
                  <td>Palabra: {mostrarPalabraAdivinada()}</td>
                </tr>
                <tr>
                  <td>Intentos restantes: {intentosRestantes}</td>
                </tr>
                <tr>
                  <td>Letras usadas:  {historialLetras.join(', ')}</td>
                </tr>
              </tbody>
            </Table>
            <Form onSubmit={letra}>
              <Form.Group className="mb-3 " controlId="letra a intentar">
                <Form.Label>Intentar una letra</Form.Label>
                <Form.Control type="text"
                    value={letry}
                    onChange={(e)=> setLetry(e.target.value)}
                    placeholder="Intente una letra" 
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Enviar letra
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CrearPartida;
