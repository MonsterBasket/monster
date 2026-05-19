import { useEffect, useRef } from "react";
import CTA from "./CTA.js"
import Title from "./Title.js"

export default function TitleSection(){
  const logo = useRef();
  const logoRect = useRef();

  function resize(){
    setTimeout(()=> {logoRect.current = logo.current.getBoundingClientRect()}, 260);
  }
  useEffect(() => resize(),[])

  function getCoords(e){
    logo.current.style.setProperty('--x', e.clientX - logoRect.current.left + 'px');
    logo.current.style.setProperty('--y', e.clientY - logoRect.current.top + 'px');
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
    <div className="titleLeft">
      <div className="logo">
        <div ref={logo} className="logoCover"/>
      </div>
      <Title />
    </div>
    <div className="titleRight">
      <div className="rightHeading">
        <p>Wicked Websites</p>
        <p>That Sell</p>
      </div>
      <CTA text={"GET ONE!"} a={"https://calendly.com/monsterbasketaus/30min"}/>
    </div>
  </>
}