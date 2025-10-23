import { Link } from "react-router-dom";
import "../CSS/menu.css";
import { useEffect, useRef, useState } from "react";

export default function MonsterMenu(){
  const detRef = useRef();
  const [menuClose, setMC] = useState("closed");

  // function blur(){
  //   // if (detRef.current.hasAttribute('open'))
  //     // {
  //     setMC("closed")
  //     setTimeout(() => {
  //       // detRef.current.removeAttribute('open')
  //       setMC("");
  //     }, 200);
  //   // }
  // }
  // function click(e){
  //   console.log(e.target)
  //   if (e.target.tagName === 'SUMMARY') {
  //     e.stopPropagation();
  //     e.preventDefault();
  //   }
  //   if (detRef.current.hasAttribute('open')) blur();
  //   else detRef.current.setAttribute('open', '');
  // }

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
    e.stopPropagation();
    if (e.target.tagName !== 'A') setMC(menuClose === "open" ? "closed" : "open");
  }

  return <>
    <button ref={detRef} id="monsterMenu" onClick={e => toggle(e)}>&equiv;
      <ul className={menuClose}>
        <Link to ="/#bg"      ><li className="monsterMenuButton">Home</li></Link>
        <Link to ="/portfolio"><li className="monsterMenuButton">Something</li></Link>
        <Link to ="/portfolio"><li className="monsterMenuButton">James's Portfolio</li></Link>
        <Link to ="/playOld"  ><li className="monsterMenuButton">Old Game</li></Link>
      </ul>
    </button>
  </>
}