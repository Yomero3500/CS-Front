import { React, useState, useEffect } from 'react';
import '../styles/inicio.style.css';
import axios from "axios";
import Swal from "sweetalert2";

const Principal = () => {
  const [palabraSecreta, setPalabraSecreta] = useState('');
  const [palabraAdivinada, setPalabraAdivinada] = useState([]);
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [letraSeleccionada, setLetraSeleccionada] = useState('');
  const [historialLetras, setHistorialLetras] = useState([]);
  const [partida, setPartida] = useState('');

  useEffect(() => {
    fetchPalabra();
  }, []); 

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
  const manejarLetra = async () => {
    const letraMinuscula = letraSeleccionada.toLowerCase();

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
          text: "No se ha adivinado la palabra en el tiempo requerido"
        })
      }
    }
  };

  const mostrarPalabraAdivinada = () => {
    return palabraAdivinada.map((letra, index) => (letra ? palabraSecreta[index] : '_')).join(' ');
  };

  return (
    <div className='containerGlobaSesion'>
      <h2>Juego del Ahorcado</h2>
      <h5>ID del juego: {partida}</h5>
      <p>Palabra: {mostrarPalabraAdivinada()}</p>
      <p>Intentos restantes: {intentosRestantes}</p>
      <p>Letras seleccionadas: {historialLetras.join(', ')}</p>
      <input
        type="text"
        maxLength="1"
        value={letraSeleccionada}
        onChange={(e) => setLetraSeleccionada(e.target.value)}
      />
      <button onClick={manejarLetra}>Intentar letra</button>
    </div>
  );
};

export default Principal;
