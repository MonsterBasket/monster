import { useBodyScrollPosition } from "@n8tb1t/use-scroll-position"
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import './App.css';
import Monster from './components/Monster.js';
import MonsterMenu from './components/Menu.js';
import WebDesign from './components/WebDesign.js';

// import './portfolio/components/CSS/App.css';
import PortSplash from './portfolio/components/Splash.tsx'
import About from './portfolio/components/About.tsx';
import Work from './portfolio/components/Work.tsx'
import Contact from './portfolio/components/Contact.tsx';
import Hello from './portfolio/components/Hello.tsx';
import Menu from './portfolio/components/Menu.tsx';
import Projects from './portfolio/components/Projects.tsx';
import Tabs from './portfolio/components/Tabs.tsx';

import axios from 'axios';
// import './old_game/App.css';
import Admin from "./old_game/Pages/Admin/Admin.js";
import MapMaker from "./old_game/Pages/DevTools/MapMaker.js"
import Login from "./old_game/Pages/Login/Login.js"
import Signup from "./old_game/Pages/Signup/Signup.js"
import SelectCharacter from "./old_game/Pages/SelectCharacter/SelectCharacter.js"
import GameController from "./old_game/Pages/Game/GameController.js"
export const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function App() {
  const [buttonWidth, setButtonWidth] = useState(window.innerWidth > 500 ? 100 : window.innerWidth / 5)
  const [scrollPos, setScroll] = useState(0)
  const [buttonOpacity, setButtonOpacity] = useState(1)
  const [turnToCheat, setTurnToCheat] = useState(0)

  const [user, setUser] = useState({})
  const [isLoggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate();
  const [character, setPlayCharacter] = useState({})

  useEffect(() => {
    if (window.location.pathname.includes('/playOld')){
      loginStatus()
    }
  }, [window.location.pathname])

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

  useBodyScrollPosition(({ prevPos, currPos }) => {
    let tempPos = -currPos.y / (window.innerHeight * 4.5)
    setScroll(Math.min(tempPos, 1))
  })

  useEffect(() => {
    if (window.location.pathname.includes('/playOld')){
      if (isLoggedIn) navigate("/playOld/select-character")
      else navigate("/playOld/login")
    }
  }, [user, isLoggedIn])

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Monster />} />
        <Route path="/portfolio" element={
          <PortSplash>
            <MonsterMenu />
            <Hello scrollPos={scrollPos} />
            <Tabs buttonWidth={buttonWidth} buttonOpacity={buttonOpacity} turnToCheat={turnToCheat} setTurnToCheat={setTurnToCheat} names={["About", "Projects", "Work", "Contact"]}>
              <Contact turnToCheat={turnToCheat} />
              <Projects turnToCheat={turnToCheat} />
              <Work turnToCheat={turnToCheat} />
              <About turnToCheat={turnToCheat} />
            </Tabs>

            <Menu scrollPos={scrollPos} buttonWidth={buttonWidth} setButtonWidth={setButtonWidth} buttonOpacity={buttonOpacity} setButtonOpacity={setButtonOpacity} setTurnToCheat={setTurnToCheat}/>
          </PortSplash>
        } />
        <Route path="/webDesign" element={<WebDesign />} />
        {isLoggedIn ? <>
          <Route path="/playOld/select-character" element={<SelectCharacter user={user} setPlayCharacter={setPlayCharacter} handleLogout={handleLogout} />} />
          <Route path="/playOld/login" element={<GameController character={character} />} />
          <Route path="/playOld/mapmaker" element={<MapMaker />} />
          {user.is_admin} ? <>
            <Route path="/playOld/admin" element={<Admin user={user} handleLogout={handleLogout} />} />
          </> : {""}
        </> : <>
          <Route path="/playOld/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/playOld/signup" element={<Signup handleLogin={handleLogin} />} />
        </>}

      </Routes>
    </div>
  );
}