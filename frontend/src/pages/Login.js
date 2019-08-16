import React, { useState } from 'react';
import logo from '../assets/logo.svg';
import './Login.css'
import api from '../services/api';

export default function Login({history}) {
  const [username, setUsername] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await api.post('/devs', {
        username
      });
      
      const { _id } = response.data;
      history.push(`/main/${_id}`);
    } catch (error) {
      if(error.response.status === 404)
        alert('Usuário não encontrado no Github');
    }
  }

  return(
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev"/>
        <input 
          type="text" 
          placeholder="Digite seu usário do Github"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}