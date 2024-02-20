import React, { useState } from 'react'
import { Col, Row, Form } from 'react-bootstrap';
import axios from "axios";
import nombreLogo from '../assets/img/Nombreahorcdo.png'
import ahorcado from '../assets/img/ahorcado.png'
import '../styles/inicio.style.css'
import Swal from "sweetalert2";
import { Button } from 'react-bootstrap';

function AgregarUsuario() {
    const [nombre, setNombre] = useState("");
    const [password, setpassword] = useState("");
    const [errorMessages, setErrorMessages] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors= {};
        if (nombre.trim().length>8) {
            errors.Usuario = "El nickname no puede tener más de 8 caracteres";
        }
        if (nombre.trim().length>8) {
            errors.Password = "La contraseña no puede tener más de 8 caracteres";
        }
        if (nombre.trim().length === 0) {
            errors.Usuario = "La contraseña no puede estar vacia"
        }
        if (password.trim().length === 0) {
            errors.Password = "La contraseña no puede estar vacia"
        }
        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }
        try {
            const IniciarSesion = await axios.post("http://localhost:3000/players/add",{    
                    nombre,
                    password       
            })
            if (IniciarSesion.data.message === "Usuario creado") {
                Swal.fire({
                icon: "success",
                title: "Easy",
                text: "Bienvenido "+ nombre,
              });
            }else{
                Swal.fire({
                    icon: "error",
                    title: "...Ooops",
                    text: "Usuario no resgistrado "
                  });
            }
            
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div className='containerGlobaSesion'>
            <header className='hdSesion'>
                <img src={nombreLogo} alt='' />
            </header>
            <Row>
                <Col className='Col1' sm={4}>
                    <Form onSubmit={handleSubmit}>
                        <label style={{fontSize:"1.5em"}}>Agregar un nuevo usuario</label><br /><br />
                        <input
                            type="text"
                            placeholder='Usuario'
                            value={nombre}
                            onChange={(e)=> setNombre(e.target.value)}
                        /><br />
                        <div style={{ display: 'flex', marginLeft: '10%' }}>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                        </div>
                        <br />
                        <input
                            type="text"
                            placeholder='Password'
                            value={password}
                            onChange={(e)=> setpassword(e.target.value)}
                        /><br />

                        <div style={{ display: 'flex', marginLeft: '10%' }}>
                            <span className='spLinea'><hr /></span>{''}
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                            <span className='spLinea'><hr /></span>
                        </div>
                        <br />

                        <Button variant='success' type='submit' style={{fontSize:"1.3em"}}>Registrar</Button>
                    </Form>
                </Col>

                <Col className='Col2' sm={6}>
                    <img src={ahorcado} alt='' />
                </Col>
            </Row>
        </div>
    )
}

export default AgregarUsuario