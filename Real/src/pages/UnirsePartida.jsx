import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";

const apiUrl = "http://localhost:3000";
const socket = io(apiUrl);

function UnirsePartida() {
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [palabraSecreta, setPalabraSecreta] = useState("");
  const [palabraAdivinada, setPalabraAdivinada] = useState([]);
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [historialLetras, setHistorialLetras] = useState([]);
  const [partida, setPartida] = useState("");
  const [letry, setLetry] = useState("");

  const navegar = useNavigate();

  useEffect(() => {
    const handleUsuarioConectado = () => {
      socket.emit("usuarioConectado");
    };

    socket.on("connection", handleUsuarioConectado);
    socket.on("mensaje", () => {});

    return () => {
      socket.off("connection", handleUsuarioConectado);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchPalabra();
      socket.emit('unirsePartida', partida);  
      await obtenerPalabra();
    };

    fetchData();

    const interval = setInterval(() => {
      obtenerPalabra();
    }, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [partida]);

  useEffect(() => {
    const longPolling = async () => {
      try {
        console.log(solicitudEnviada+" xvcdsdf");
        if (!solicitudEnviada) {
          setSolicitudEnviada(true);
          const response = await axios.get(`http://localhost:3000/match/unirse/longpolling/${partida}`);
          if (response.data.success) {
            if (response.data.estado === "Finalizado" || intentosRestantes === 0) {
              setSolicitudEnviada(false);
              Swal.fire({
                icon: "error",
                title: "...Ooops",
                text: "No se ha adivinado la palabra en los intentos requeridos"
              });
              navegar("/inicio");
            } 
          }
        }
        longPolling();
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setSolicitudEnviada(false);
          longPolling(); 
        }, 1000);
      }
    };
    longPolling();
  }, [solicitudEnviada]); 
  
  const letra = async (e) => {
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
      try {
        const letras = await axios.put("http://localhost:3000/match/letra", {
          id_partida: id_partida,
          letra: letraMinuscula
        });
      } catch (error) {
        console.error("Error al enviar la letra");
        console.error(error);
      }
    } else {
      const intentos = await axios.put('http://localhost:3000/match/letraIncorrecta',{
        id_partida:partida
      });
      console.log(intentos.data);
      setIntentosRestantes(intentos.data);
      if (intentosRestantes === 1) {
        await axios.put("http://localhost:3000/match/partida", {
          id_partida: partida,
          estado: "Finalizado"
        });

        Swal.fire({
          icon: "error",
          title: "...Ooops",
          text: "No se ha adivinado la palabra en los intentos requeridos"
        });
        navegar("/inicio")
      }
    }
  };

  const fetchPalabra = async () => {
    const { value: id } = await Swal.fire({
      input: "textarea",
      inputLabel: "ID de la Partida",
      inputPlaceholder: "Ingrese el ID de la partida...",
      inputAttributes: {
        "aria-label": "Ingrese el ID de la partida"
      },
      showCancelButton: true,
      confirmButtonText: "Unirse",
      cancelButtonText: "Cancelar"
    });
    if (id) {
      try {
        const id_partida = parseInt(id);
        const response = await axios.get(`http://localhost:3000/match/unirse/${id_partida}`);
        const palabra = response.data.palabra;
        setPalabraAdivinada(new Array(palabra.length).fill(false));
        setPartida(id_partida);      
        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: `Tu palabra es: ...`
        });
        return;
      } catch (error) {
        console.error("Error al unirse a la partida:", error);

        Swal.fire({
          icon: "error",
          title: "...Ooops",
          text: "Ha ocurrido un problema al unirse a la partida."
        });
      }
    }
  };

  const obtenerPalabra = async () => {
    const id_partida = partida;
    try {
      const response = await axios.get(`http://localhost:3000/match/unirse/${id_partida}`);
      const result = response.data.letras_encontradas;
      setHistorialLetras([...historialLetras, result]);
      setPalabraSecreta(response.data.palabra);
      setIntentosRestantes(response.data.intentos_restantes);
      const nuevaPalabraAdivinada = response.data.palabra.split('').map((letra, index) =>
        result.includes(letra) ? true : false
      );
      setPalabraAdivinada(nuevaPalabraAdivinada);
    } catch (error) {
      console.error(error);
    }
  };

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
                  <td colSpan={3}>ID del juego</td>
                </tr>
                <tr>
                  <td>Palabra: {mostrarPalabraAdivinada()}</td>
                </tr>
                <tr>
                  <td>Intentos restantes: {intentosRestantes}</td>
                </tr>
                <tr>
                  <td>Letras usadas: {historialLetras.join(', ')}</td>
                </tr>
              </tbody>
            </Table>
            <Form onSubmit={letra}>
              <Form.Group className="mb-3 " controlId="letra a intentar">
                <Form.Label>Intentar una letra</Form.Label>
                <Form.Control
                  type="text"
                  value={letry}
                  onChange={(e) => setLetry(e.target.value)}
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

export default UnirsePartida;
