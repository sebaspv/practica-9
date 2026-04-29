import './App.css'
// import { entries } from './data.js'
import { CardList } from './components/Cards.jsx'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

export function Blog() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [filteredText, setFilteredText] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authorId, setAuthorId] = useState(null)
  const [entries, setEntries] = useState([{
    id_post: 0, title: ""
    , date: ""
    , image: ""
    , text: ""
    , id_author: 0
  }]);
  let handleChange = (e) => {
    setFilteredText(e.target.value)
  }
  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((posts) => setEntries(posts));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/session-info`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((session) => {
        setIsLoggedIn(Boolean(session.id_author));
        setAuthorId(session.id_author ?? null);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setAuthorId(null);
      });
  }, []);

  function handleLogout() {
    fetch(`${API_URL}/logout`, {
      method: "GET",
      credentials: "include"
    })
      .then(() => {
        setIsLoggedIn(false);
        setAuthorId(null);
        navigate('/login');
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <h1>Mi blog de gatos</h1>
      <div className='filter'>
        <p>Buscar:</p>
        <input type='text' value={filteredText} onChange={handleChange}></input>
        {isLoggedIn && authorId && (
          <p>Conectado como autor #{authorId}</p>
        )}
        {isLoggedIn && (
          <button onClick={handleLogout}>Cerrar sesion</button>
        )}
      </div>
      <CardList entries={entries} filteredText={filteredText}></CardList>
    </>
  )
}
