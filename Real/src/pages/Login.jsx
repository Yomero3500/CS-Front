import React, { useState, useEffect } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import axios from 'axios';
import nombreLogo from '../assets/img/Nombreahorcdo.png';
import ahorcado from '../assets/img/ahorcado.png';
import '../styles/inicio.style.css';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';

function Login() {
  const navegar = useNavigate();
  const [nombre, setNombre] = useState('');
  const [password, setpassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => { 

    const socket = io('http://localhost:3000');
    setSocket(socket);
    
    socket.on('mensajeDesdeServidor', (mensaje) => {
      console.log('Mensaje recibido desde el servidor:', mensaje);
    });

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (nombre.trim().length > 8) {
      errors.Usuario = 'El nickname no puede tener más de 8 caracteres';
    }
    if (password.trim().length > 8) {
      errors.Password = 'La contraseña no puede tener más de 8 caracteres';
    }
    if (nombre.trim().length === 0) {
      errors.Usuario = 'La contraseña no puede estar vacía';
    }
    if (password.trim().length === 0) {
      errors.Password = 'La contraseña no puede estar vacía';
    }
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }
    try {
      const IniciarSesion = await axios.get('http://localhost:3000/players/buscarUsuario', {
        params: {
          nombre,
          password,
        },
      });
      if (IniciarSesion.data.message === 'Usuario encontrado') {
        Swal.fire({
          icon: 'success',
          title: 'Easy',
          text: 'Bienvenido ' + nombre,
        });
        localStorage.setItem('Usuario', JSON.stringify(IniciarSesion.data));
        const User = JSON.parse(localStorage.getItem('Usuario'));
        console.log(User.player.nombre);
        if (socket) {
          socket.emit('mensajeDesdeCliente', User.player.nombre);
          navegar("/inicio")
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: '...Ooops',
          text: 'Usuario no registrado ',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="containerGlobaSesion">
      <header className="hdSesion">
        <img src={nombreLogo} alt="" />
      </header>
      <Row>
        <Col className="Col1" sm={4}>
          <Form onSubmit={handleSubmit}>
            <br />
            <input
              type="text"
              placeholder="Usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <br />
            {errorMessages.Usuario && <span className="error">{errorMessages.Usuario}</span>}
            <br />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <br />
            {errorMessages.Password && <span className="error">{errorMessages.Password}</span>}
            <br />
            <Button variant="success" type="submit" style={{ fontSize: '1.3em' }}>
              Ingresar
            </Button>
          </Form>
        </Col>

        <Col className="Col2" sm={6}>
          <img src={ahorcado} alt="" />
        </Col>
      </Row>
    </div>
  );
}

export default Login;
