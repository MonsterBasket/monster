import { useEffect, useRef, useState } from "react";
import CTA from "./CTA.js"
import Title from "./Title.js"
import LightSwitch from "./LightSwitch.js";
import Spotlight from "./Spotlight.js";

export default function TitleSection(){
  const logo = useRef();
  const logoRect = useRef();
  const [lights, setLights] = useState(true);

  function resize(){
    if (logo.current)
      setTimeout(()=> {logoRect.current = logo.current.getBoundingClientRect()}, 260);
  }
  useEffect(() => resize(),[])

  useEffect(() => {
    if(lights)
      document.documentElement.style.removeProperty('--bg')
    else
      document.documentElement.style.setProperty('--bg', "#000")
  }, [lights])

  function getCoords(e){
    if (logo.current && logoRect.current){
      logo.current.style.setProperty('--x', e.clientX - logoRect.current.left + 'px');
      logo.current.style.setProperty('--y', e.clientY - logoRect.current.top + 'px');
    }
  }

  useEffect(() =>{
    window.addEventListener("mousemove", getCoords, false)
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', resize) 
    return () => {
      window.removeEventListener('scroll', resize) 
      window.removeEventListener("mousemove", getCoords, false)
      window.removeEventListener('resize', resize);
    }
  })

  return <>
    <div>{lights ? "" : <Spotlight />}</div>
    <div className="titleLeft" >
      <div className={lights ? "logo" : "logo eyes"}>
        <div ref={logo} className={lights ? "logo" : "logoCover"}/>
      </div>
      <Title lights={lights} />
      <div className="floor"></div>
    </div>
    <div className="titleRight">
      <div className="rightHeading">
        <LightSwitch lights={lights} setLights={setLights}/>
      </div>
      {/* <CTA text={"GET ONE!"} a={"https://calendly.com/monsterbasketaus/30min"}/> */}
    </div>
  </>
}