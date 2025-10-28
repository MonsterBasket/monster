import { Link, useLocation, useNavigate } from "react-router-dom";
import "../CSS/menu.css";
import { useEffect, useRef, useState } from "react";

export default function MonsterMenu(){
  const detRef = useRef();
  const [menuClose, setMC] = useState("closed");
  const path = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    window.addEventListener('pointerdown', e => handleClick(e))
  }, [])

  function handleClick(e){
    if (e.target.className === "monsterMenuButton") {
      setTimeout(() => setMC("closed"), 500);
    }
    else if (e.target.id !== "monsterMenu") setMC("closed")
  }

  function toggle(e){
    console.log(e.target.tagName)
    e.stopPropagation();
    console.log("bye")
    if (e.target.tagName !== 'LI') setMC(menuClose === "open" ? "closed" : "open");
  }

  function scrollTo(id){
    // if (path.pathname === "/" || path.pathname === "")
      nav(`/#${id}`)
      setTimeout(() => document.querySelector(`#${id}`).scrollIntoView(), 50)
  }

  return <>
    <button ref={detRef} id="monsterMenu" onClick={e => toggle(e)}>&equiv;
      <ul className={menuClose}>
        <Link to ="/#bg"      ><li className="monsterMenuButton" onClick={e=> scrollTo("bg")}>Home</li></Link>
        <Link to ="/#gallery" ><li className="monsterMenuButton" onClick={e=> scrollTo("gallery")}>Gallery</li></Link>
        <Link to ="/portfolio"><li className="monsterMenuButton">James's Portfolio</li></Link>
        <Link to ="/playOld"  ><li className="monsterMenuButton">Old Game</li></Link>
      </ul>
    </button>
  </>
}