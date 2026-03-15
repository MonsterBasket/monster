import { useEffect } from 'react';
import './tobeornot.css'

export default function Tobeornot(mX,mY){
  function mouseMove(e){
    // some dirty magic numbers here, I'll explain these at https://www.linkedin.com/article/7270727866630205440/
    let z = Math.min(Math.max((e.clientX / window.innerWidth * 4 + 3), 3.7), 6.2);
    document.documentElement.style.setProperty('--z', '-' + z + 's');
  }

  useEffect(()=>{
    document.addEventListener("mousemove", mouseMove)
    return document.removeEventListener("mousemove", mouseMove)
  }, [])
  return <div className="pen TBbody">
    <div class="TBcont">
      <div class="TBa">TO BE OR</div>
      <div class="TBskull"><div></div></div>
      <div class="TBb">NOT TO BE</div>
    </div>
    <div className="TBcursor" style={{left: mX - 15 + "px", top: mY - 15 +"px"}}></div>
  </div>
}
