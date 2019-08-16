import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Main.css';
import io from 'socket.io-client';

export default function Main({ match }) {

  const [devs, setDevsState] = useState([]);
  const [matchDev, setMatchDev] = useState(null);
  const [loading, setLoading] = useState(true);
  var matchContainer = document.querySelector('.match-container');

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const response = await api.get('/devs', {
        headers: {
          user: match.params.devId,
        }
      });
      setLoading(false);    
      setDevsState(response.data);
    }
    loadUsers();
  }, [match.params.devId]);

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { user: match.params.devId }
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    })
  }, [match.params.devId]);

  window.onclick = event => {
    if (event.target === matchContainer)
      matchContainer.classList.add('close');
  }

  function closeModal() {
    matchContainer.classList.add('close');
  }

  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: {
        user: match.params.devId
      },
    });
    setDevsState(devs.filter(dev => dev._id !== id));
  }

  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: {
        user: match.params.devId
      },
    });
    setDevsState(devs.filter(dev => dev._id !== id));
  }

  return (
    <div className="main-container">
      <Link to="/">
        <img src={logo} alt="Tindev" />
      </Link>
      { !loading && devs.length === 0 
      ? (<div className="empty">Acabou :(</div>) 
      : (<ul>
          {devs.map(dev => (
            <li key={dev._id}>
              <img src={dev.avatar_url} alt={dev.name} />
              <footer>
                <a href={dev.html_url}><strong>{dev.name}</strong></a>
                <p>{dev.bio}</p>
              </footer>
              <div className="buttons">
                <button type="button" onClick={() => handleDislike(dev._id)}>
                  <img src={dislike} alt="Dislike" title={"Dislike " + dev.name} />
                </button>
                <button type="button" onClick={() => handleLike(dev._id)}>
                  <img src={like} alt="Like" title={"Like " + dev.name} />
                </button>
              </div>
            </li>))}
        </ul>
        )}

      { matchDev && (
        <div className="match-container">
          <img src="https://raw.githubusercontent.com/Rocketseat/semana-omnistack-8/master/frontend/src/assets/itsamatch.png" alt="It's a match" />

          <img className="avatar" src={matchDev.avatar_url} alt="" />
          <a href={matchDev.html_url}><strong>{matchDev.name}</strong></a>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => closeModal()}>FECHAR</button>
        </div>
      )}
    </div>
  )
}