import Splash from "./Splash";
import Menu from "./Menu";
import "../CSS/monster.css"
import Gallery from "./Gallery";
import Contact from "./Contact";
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