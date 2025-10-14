import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Title from '../../components/Pages/Title.tsx';
import '../Login/home.css';
import knight from "../../images/knight.png"
import rogue from "../../images/rogue.png"
import mage from "../../images/mage.png"
import axios from 'axios';
import { serverUrl } from '../../App';

function SelectCharacter({ user, setPlayCharacter, handleLogout }) {
  const navigate = useNavigate();
  const [character, setCharacter] = useState({})
  const [newCharacter, setNewCharacter] = useState({ name: "", role: "Knight" })
  const [characterCreator, setCreator] = useState(false)
  const [imgUrl, setImg] = useState(knight)
  const [errorDisplay, setError] = useState([])
  const [savedCharacters, setSavedCharacters] = useState([{ name: "", role: "" }])
  const timer = useRef(0);

  useEffect(() => { if (user) getCharacters() }, [])

  function getCharacters() { //user is not set the first time you create an account - it's also showing other user's characters
    axios.get(`${serverUrl}characters`, { params: { user_id: user.id } }, { withCredentials: true })
      .then(res => {
        if (res.status === 200) {
          if (res.data.characters.length === 0) setCreator(true)
          else {
            setSavedCharacters(res.data.characters)
            setCharacter(res.data.characters[0])
            showCharacter(res.data.characters[0])
          }
        }
        else {
          console.log(res)
          setError(res.data.errors)
        }
      })
      .catch(err => console.log("Error retrieving characters:", err))
  }

  function buttons() {
    if (characterCreator) return <button className="createButton" onClick={createCharacter}>Create Character</button>
    else
      return <><button key="newChar" className="newButton" onClick={() => setCreator(true)}>New</button>
        <button key="play" className="playButton" onClick={() => play(character)}>Play</button>
        <button key="del" className="deleteButton" onClick={deleteCharacter}>Delete</button></>
  }

  function play(character) {
    setPlayCharacter(character)
    navigate("/")
  }

  function deleteCharacter() {
    if (window.confirm(`Are you sure you want to delete ${character.name}`)) {
      axios.delete(`${serverUrl}characters/${character.id}`)
        .then(res => {
          if (res.data.characters.length === 0) setCreator(true)
          else {
            setSavedCharacters(res.data.characters)
            setCharacter(res.data.characters[0])
            showCharacter(res.data.characters[0])
          }
        })
    }
  }

  function createCharacter() {
    const sendCharacter = { ...newCharacter, user_id: user.id }
    if (Object.keys(character).length !== 0) {
      axios.post(`${serverUrl}characters`, sendCharacter, { withCredentials: true })
        .then(res => {
          if (res.data.status === "created") {
            play(res.data.character)
            console.log(res.data.character)
          }
          else setError(res.data.errors)
        })
        .catch(err => console.log("create character error:", err))
    }
    else setError(["Please enter a name"])
  }

  function showCharacter(character) {
    if (character !== undefined) { // if (!character) ???
      if (!characterCreator) setCharacter(character)
      else {
        setNewCharacter({ name: newCharacter.name, role: character.role })
      }
      if (character.role === "Knight") setImg(knight)
      if (character.role === "Mage") setImg(mage)
      if (character.role === "Rogue") setImg(rogue)
    }
    else setCreator(true)
  }

  function characters() {
    if (characterCreator) return [
      { name: "", role: "Knight" },
      { name: "", role: "Rogue" },
      { name: "", role: "Mage" }]
    else if (savedCharacters) return savedCharacters
    else return []
  }

  useEffect(() => showCharacter(characters()[0]), [characterCreator])

  function sanitizeName(e) {
    let name = e.target.value
    name = name.replace(/[^a-z]/gim, "")
    if (name !== e.target.value) setError(["Name can only have letters"])
    if (name.length > 0)
      name = name[0].toUpperCase() + name.substring(1).toLowerCase()
    setNewCharacter({ ...newCharacter, name: name.trim() })
  }

  function hideErrors() {
    if (errorDisplay.length === 0) return "hidden"
    else {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setError([]), 2000)
      return "notHidden"
    }
  }

  return <div id="selectCharacter">
    <button className="logoutButton" onClick={handleLogout}>Logout</button>
    {user.is_admin ? <Link to="/admin"><button className="littleButton">Admin Portal</button></Link> : ""}
    <Title size={1} />
    <h2>Select Character</h2>
    <div id="characterSelector">
      <div id="characterListLeft">
        <div id="characterList">
          {characterCreator ? <div id="createHeader">Create a Character</div> : ""}
          {characters().map((character, index) => <div key={index} className={`${character.role}Button`} onClick={() => showCharacter(character)}>{character.name || character.role}</div>)}
        </div>
        {characterCreator ? <input type="text" name="name" className="nameInput" placeholder="Character Name" onChange={(e) => sanitizeName(e)} value={newCharacter.name} /> : ""}
        <div id="characterListButtons">{buttons()}</div>
      </div>
      <div id="characterListRight">
        <div id="characterStats">
          {characterCreator ? `${newCharacter.name ? `${newCharacter.name} - ` : ""}${newCharacter.role} - Level 1` : `${character.name} - ${character.role} - Level ${character.level}`}
        </div>
        <div id="characterListImage" style={{ backgroundImage: `url(${imgUrl})` }}></div>
      </div>
      {<div id="errorDisplay" className={hideErrors()}>{errorDisplay.map(item => <span key={item}>{item}<br /></span>)}</div>}
    </div>
    {characterCreator && savedCharacters.length > 0 ? <button className="littleButton back" onClick={() => setCreator(false)}>Back</button> : ""}
    <Link to="/admin/mapmaker"><button>Map Editor</button></Link>
  </div>
}

export default SelectCharacter;