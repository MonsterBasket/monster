import { useEffect } from 'react';
import './tired.css'

export default function Tired({mX, mY}){
  let x = 0;
  let y = 0;
  let xs = 0;
  let ys = 0;
  let first = true;
  let finished = false;
  let lastRibbon;
  let ribbon;
  let front = false;
  let angle = 0;
  let z = 0;

  useEffect(() => {
    document.addEventListener("click", e => stop(e))
    return document.removeEventListener("click", e => stop(e))
  },[])

  useEffect(() => {
    if (finished) {
      finished = false;
      if (!front && lastRibbon) lastRibbon.style.borderRadius = "20px"
      front = !front;
      z += front ? 2 : -1;
      ribbon = document.createElement("div");
      ribbon.classList.add(front ? "TIa" : "TIb");
      ribbon.style.zIndex = z;
      document.getElementById("cont").appendChild(ribbon);
    }
    if (ribbon) {
      angle = Math.atan2(mY - ys, mX - xs) * 180 / Math.PI;
      const pa = mX - xs;
      const pb = mY - ys;
      const distance = Math.sqrt( pa*pa + pb*pb );
      ribbon.style.width = distance + "px";
      x = Math.round(Math.cos(angle * Math.PI / 180) * (distance - 40) + xs);
      y = Math.round(Math.sin(angle * Math.PI / 180) * (distance - 40) + ys);
      if (angle > -90 && angle < 90){
        const nx = Math.round(Math.cos(angle * Math.PI / 180) * (20 - distance) + x);
        const ny = Math.round(Math.sin(angle * Math.PI / 180) * (20 - distance) + y);
        ribbon.style.left = nx + "px";
        ribbon.style.top = ny + "px";
        ribbon.style.rotate = angle + "deg";
        if (!front) ribbon.style.borderRadius = "20px 0 0 20px"
      }
      else{
        const nx = Math.round(Math.cos(angle * Math.PI / 180) * (40) + x);
        const ny = Math.round(Math.sin(angle * Math.PI / 180) * (40) + y);
        ribbon.style.rotate = angle - 180 + "deg";
        ribbon.style.left = nx + "px";
        ribbon.style.top = ny + "px";
        if (!front) ribbon.style.borderRadius = "0 20px 20px 0"
      }
    }
    document.documentElement.style.setProperty('--TIx', mX + 'px');
    document.documentElement.style.setProperty('--TIy', mY + 'px');
  }, [mX,mY])

  function stop(e){
    if (first){
      x = mX;
      y = mY;
      first = false;
    }
    finished = true;
    xs = Math.round(Math.cos(angle * Math.PI / 180) * 20 + x);
    ys = Math.round(Math.sin(angle * Math.PI / 180) * 20 + y);
    lastRibbon = ribbon;
    ribbon = '';
  }

  return <div className="pen TIbody">
    <div id="TIcont"></div>
    <div class="TIpointer"></div>
  </div>
}
