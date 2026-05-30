import { useEffect, useRef } from "react";

export default function Spotlight(){
  const spotlight = useRef();

  function a(e){
    spotlight.current.style.setProperty('--x', `calc(${e.clientX}px - 6vw)`)
    spotlight.current.style.setProperty('--y', `calc(${e.clientY}px - 6vw)`)
  }

  useEffect(() =>{
    window.addEventListener("mousemove", a, false)
    return () => {
      window.removeEventListener("mousemove", a, false)
    }
  })
  

  return <div ref={spotlight} className="spotLight"></div>

}