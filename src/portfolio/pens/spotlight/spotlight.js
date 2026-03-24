import { useEffect, useRef, useState } from 'react';
import './spotlight.css'

export default function Spotlight({mX, mY}){
  const box = useRef();
  const body = useRef();
  const boxStyle = useRef({})
  const cursorStyle = useRef({})
  const [centre, setCentre] = useState({x:0, y:0})
  const [offset, setOffset] = useState({x:0, y:0})

  useEffect(()=>{
    if (box.current){
      const boxRect = box.current.getBoundingClientRect()
      const bodyRect= body.current.getBoundingClientRect()
      setCentre({
        x: boxRect.left + boxRect.width/2, 
        y: boxRect.top + boxRect.height/2
      })
      setOffset({
        x: bodyRect.left,
        y: bodyRect.top
      })
    }
  },[])

  useEffect(()=>{
    if (box.current){
      let angle = Math.atan2(mX - centre.x, - (mY - centre.y) )*(180 / Math.PI);	    
      boxStyle.current = {transform: `rotate(${angle}deg)`}
    
      const mouseY = mY - offset.y - 15;
      const mouseX = mX - offset.x - 15;
      
      cursorStyle.current = {transform: `translate3d(${mouseX}px, ${mouseY}px, 0)`}
      // cursorStyle.current = {transform: `translate3d(${mouseX}px, ${mouseY}px, 0)`, left: mX - 15 + "px", top: mY - 15 +"px"}
    }
  }, [mX, mY])

  return <div ref={body} className="pen SLbody">
    <ul>
      <a href="https://www.telpian.com/" target="_blank" rel="noreferrer"><li><div>1997</div><div>SUZ SIRUNYAN</div><div>&rarr;</div></li></a>
      <li><div>2025</div><div>OPERATION STARLIGHT</div><div>&rarr;</div></li>
      <li><div>2025</div><div>JURASSIC PARK REVEAL</div><div>&rarr;</div></li>
      <li><div>2023</div><div>PROJECT PHOENIX</div><div>&rarr;</div></li>
      <li><div>2025</div><div>REVOLUTION</div><div>&rarr;</div></li>
      <li><div>2025</div><div>GENETIC ENHANCEMENT</div><div>&rarr;</div></li>
      <li><div>2003</div><div>100 DAYS CHALLENGE</div><div>&rarr;</div></li>
      <li><div>2024</div><div>INFINITI</div><div>&rarr;</div></li>
      <li><div>2024</div><div>SKYNET INITIATIVE</div><div>&rarr;</div></li>
      <li><div>2022</div><div>JURASSIC PARK AGAIN</div><div>&rarr;</div></li>
      <li><div>2023</div><div>GLOBAL</div><div>&rarr;</div></li>
      <li><div>2003</div><div>HOVER INTERACTION</div><div>&rarr;</div></li>
      <li><div>1983</div><div>JAMES BLASKETT</div><div>&rarr;</div></li>
      <li><div>2023</div><div>DAY 74/100</div><div>&rarr;</div></li>
    </ul>
    <div ref={box} className="SLspotlight" style={boxStyle.current}><div>WORK</div></div>
    <div className="SLcursor" style={cursorStyle.current}></div>
  </div>
}
