import { useEffect, useRef } from 'react';
import './tired.css'

export default function Tired({mX, mY}){
  const body = useRef()
  const bodyRect = useRef({x: 0, y: 0})
  const cursor = useRef({x: 0, y: 0})
  const cursorStyle = useRef({})
  let tx = useRef(0);
  let ty = useRef(0);
  let xs = useRef(0);
  let ys = useRef(0);
  let first = useRef(true);
  let finished = useRef(false);
  let lastRibbon = useRef();
  let ribbon = useRef();
  let front = useRef(false);
  let angle = useRef(0);
  let z = useRef(0);

  useEffect(() => {
    cursor.current = ({
      x: mX - bodyRect.current.x,
      y: mY - bodyRect.current.y
    })
    cursorStyle.current = {transform: `translate(${cursor.current.x - 10}px, ${cursor.current.y - 10}px)`}

    if (finished.current) {
      finished.current = false;
      if (!front.current && lastRibbon.current) lastRibbon.current.style.borderRadius = "20px"
      front.current = !front.current;
      z.current += front.current ? 2 : -1;
      ribbon.current = document.createElement("div");
      ribbon.current.classList.add(front.current ? "TIa" : "TIb");
      ribbon.current.style.zIndex = z.current;
      body.current.appendChild(ribbon.current);
    }
    if (ribbon.current) {
      angle.current = Math.atan2(cursor.current.y - ys.current, cursor.current.x - xs.current) * 180 / Math.PI;
      const pa = cursor.current.x - xs.current;
      const pb = cursor.current.y - ys.current;
      const distance = Math.sqrt( pa*pa + pb*pb );
      ribbon.current.style.width = distance + "px";
      tx.current = Math.round(Math.cos(angle.current * Math.PI / 180) * (distance - 40) + xs.current);
      ty.current = Math.round(Math.sin(angle.current * Math.PI / 180) * (distance - 40) + ys.current);
      if (angle.current > -90 && angle.current < 90){
        const nx = Math.round(Math.cos(angle.current * Math.PI / 180) * (20 - distance) + tx.current);
        const ny = Math.round(Math.sin(angle.current * Math.PI / 180) * (20 - distance) + ty.current);
        ribbon.current.style.left = nx + "px";
        ribbon.current.style.top = ny + "px";
        ribbon.current.style.rotate = angle.current + "deg";
        if (!front.current) ribbon.current.style.borderRadius = "20px 0 0 20px"
      }
      else{
        const nx = Math.round(Math.cos(angle.current * Math.PI / 180) * (40) + tx.current);
        const ny = Math.round(Math.sin(angle.current * Math.PI / 180) * (40) + ty.current);
        ribbon.current.style.rotate = angle.current - 180 + "deg";
        ribbon.current.style.left = nx + "px";
        ribbon.current.style.top = ny + "px";
        if (!front.current) ribbon.current.style.borderRadius = "0 20px 20px 0"
      }
    }
  },[mX, mY])

  useEffect(() => {
  const rect = body.current.getBoundingClientRect()
  bodyRect.current = {x: rect.x, y: rect.y}

  body.current.addEventListener("click", stop, false)
  return body.current.removeEventListener("onclick", stop, false)
  }, [])

  function stop(){
    console.log("hello")
    if (first.current){
      tx.current = cursor.current.x;
      ty.current = cursor.current.y;
      first.current = false;
    }
    finished.current = true;
    xs.current = Math.round(Math.cos(angle.current * Math.PI / 180) * 20 + tx.current);
    ys.current = Math.round(Math.sin(angle.current * Math.PI / 180) * 20 + ty.current);
    lastRibbon.current = ribbon.current;
    ribbon.current = '';
  }

  return <div ref={body} className="pen TIbody">
    <div className="TIcont"></div>
    <div className="TIpointer" style={cursorStyle.current}></div>
  </div>
}
