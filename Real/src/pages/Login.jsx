import React, { useState } from 'react'
import { Col, Row, Form } from 'react-bootstrap';
import nombreLogo from '../assets/img/Nombreahorcdo.png'
import ahorcado from '../assets/img/ahorcado.png'
import '../styles/inicio.style.css'
import { Button } from 'react-bootstrap';

function Login() {
    const [Usuario, setUsuario] = useState("");
    const [Password, setPassword] = useState("");
    const [errorMessages, setErrorMessages] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors= {};
        if (Usuario.trim().length>8) {
            errors.Usuario = "El nickname no puede tener más de 8 caracteres";
        }
        if (Password.trim().length>8) {
            errors.Password = "La contraseña no puede tener más de 8 caracteres";
        }
        if (Usuario.trim().length === 0) {
            errors.Usuario = "La contraseña no puede estar vacia"
        }
        if (Password.trim().length === 0) {
            errors.Password = "La contraseña no puede estar vacia"
        }
        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }
        try {
            
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
                        <label>Usuario:</label><br />
                        <input
                            type="text"
                            placeholder='Usuario'
                            value={Usuario}
                            onChange={(e)=> setUsuario(e.target.value)}
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

                        <label>Password:</label><br />
                        <input
                            type="text"
                            placeholder='Password'
                            value={Password}
                            onChange={(e)=> setPassword(e.target.value)}
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

                        <Button variant='success'>Ingresar</Button>
                    </Form>
                </Col>

                <Col className='Col2' sm={6}>
                    <img src={ahorcado} alt='' />
                </Col>
            </Row>
        </div>
    )
}

export default Login