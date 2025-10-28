import Splash from "./Splash";
import Menu from "./Menu";
import "../CSS/monster.css"
import Gallery from "./Gallery";
import Contact from "./Contact";

export default function Monster(){


  return <div id="home">
    <Splash/>
    <Menu />
    <Gallery />
    <Contact />
  </div>
}