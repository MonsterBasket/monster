import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import './App.css';
import Admin from "./Pages/Admin/Admin.js";
import MapMaker from "./Pages/DevTools/MapMaker.js"
import Login from "./Pages/Login/Login.js"
import Signup from "./Pages/Signup/Signup.js"
import SelectCharacter from "./Pages/SelectCharacter/SelectCharacter.js"
import GameController from "./Pages/Game/GameController.js"
export const serverUrl = process.env.REACT_APP_SERVER_URL;

function App() {
  const [user, setUser] = useState({})
  const [isLoggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate();
  const [character, setPlayCharacter] = useState({})

  useEffect(() => loginStatus(), [])

  function loginStatus() {
    axios.get(`${serverUrl}logged_in`, { withCredentials: true })
      .then(response => {
        if (response.data.logged_in) handleLogin(response.data)
        else handleLogout()
      })
      .catch(error => console.log('api errors:', error))
  }

  function handleLogin(data) {
    setUser(data.data.user)
    setLoggedIn(true)
  }
  function handleLogout() {
    axios.post(`${serverUrl}logout`, user, { withCredentials: true })
      .then(() => {
        setUser({});
        setLoggedIn(false);
      })
  }

  useEffect(() => {
    if (isLoggedIn) navigate("/select-character")
    else navigate("/login")
  }, [user])

  return (
    <div className="App">
      <Routes>
        {isLoggedIn ? <>
          <Route path="/select-character" element={<SelectCharacter user={user} setPlayCharacter={setPlayCharacter} handleLogout={handleLogout} />} />
          <Route path="/" element={<GameController character={character} />} />
          <Route path="/admin/mapmaker" element={<MapMaker />} />
          {user.is_admin} ? <>
            <Route path="/admin" element={<Admin user={user} handleLogout={handleLogout} />} />
          </> : {""}
        </> : <>
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />
        </>}
      </Routes>
      <div className="portraitCover">Please rotate your device.</div>
    </div>
  );
}

export default App;
