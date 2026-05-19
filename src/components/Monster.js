import Splash from "./monsterSubs/Splash";
import Menu from "./monsterSubs/Menu";
import "../CSS/monster.css"
import Gallery from "./monsterSubs/Gallery";
import Contact from "./monsterSubs/Contact";
import { useEffect, useRef } from "react";

export default function Monster(){
  const home = useRef();

  useEffect(() => {
    home.current.scrollIntoView()
  },[])

  return <div ref={home} id="home">
    <Splash/>
    <Menu />
    <Gallery />
    <Contact />
  </div>
}