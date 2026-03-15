import { useEffect } from 'react';
import './spotlight.css'

export default function Spotlight(mX, mY){
  let box = document.querySelector(".spotlight");
  let boxBoundingRect = box.getBoundingClientRect();
  let boxCenter= {
    x: boxBoundingRect.left + boxBoundingRect.width/2, 
    y: boxBoundingRect.top + boxBoundingRect.height/2
  };
  const cursor = document.querySelector('.cursor');

  useEffect(()=>{
    let angle = Math.atan2(mX - boxCenter.x, - (mY - boxCenter.y) )*(180 / Math.PI);	    
    box.style.transform = `rotate(${angle}deg)`;
  
    const mouseY = mY - 23;
    const mouseX = mX - 22;
    
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, [mX, mY])

  return <div className="pen SLbody">
    <ul>
      <a href="https://www.telpian.com/" target="_blank"><li><div>1997</div><div>SUZ SIRUNYAN</div><div>&rarr;</div></li></a>
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
      <a href="https://www.MonsterBasket.com.au" target="_blank"><li><div>1983</div><div>JAMES BLASKETT</div><div>&rarr;</div></li></a>
      <li><div>2023</div><div>DAY 74/100</div><div>&rarr;</div></li>
    </ul>
    <div class="SLspotlight"><div>WORK</div></div>
    <div className="SLcursor" style={{left: mX - 15 + "px", top: mY - 15 +"px"}}></div>
  </div>
}
