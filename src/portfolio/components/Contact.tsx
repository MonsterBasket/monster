import { ReactElement, useEffect, useRef, useState } from "react"
import "./CSS/contact.css"

type Props = {turnToCheat: number;}

export default function Contact({turnToCheat}: Props){

  const active = useRef<boolean>(false);
  const lastRender = useRef<number>(0)
  const [renderLeaves, setRenderLeaves] = useState<ReactElement[]>([])
  const leafClasses:string[] = ["leaf", "blossom"]
  const leafMoves:string[] = ["leafSway1", "leafSway2", "leafSway3"]
  const leafSpins:string[] = ["leafSpin1", "leafSpin2", "leafSpin3"]
  const page = useRef<number>(1);
  const gustSpeed = useRef<number>(0);
  const gustTarget = useRef<number>(0);

  const [textWidth, setTextWidth] = useState<object>({gridTemplateColumns: "90% 5% 5%"})
  const [t1Style, setT1Style] = useState<object>({background: "rgba(0,0,0,0"})
  const [t2Style, setT2Style] = useState<object>({background: "rgba(0,0,0,0.1"})
  const [t3Style, setT3Style] = useState<object>({background: "rgba(0,0,0,0.2"})

  const xTouch = useRef<number>(0);
  const yTouch = useRef<number>(0);

  useEffect(() => {
    if (turnToCheat == 0){
      active.current = true;
      requestAnimationFrame((now) => animate(now))
      window.addEventListener('touchstart', handleTouchStart, false);
      window.addEventListener('touchmove', handleTouchMove, false);
    }
    else {
      active.current = false;
      window.removeEventListener('touchstart', handleTouchStart, false);        
      window.removeEventListener('touchmove', handleTouchMove, false);
    }
    return () => {
      window.removeEventListener('touchstart', handleTouchStart, false);        
      window.removeEventListener('touchmove', handleTouchMove, false);
    };  
  }, [turnToCheat])
                                                                           
  useEffect(() => {
    document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");
    makeLeaves()
    active.current = true;
    requestAnimationFrame((now) => animate(now))
  }, [])

  function handleTouchStart(e:any) {
    xTouch.current = e.touches[0].clientX;                                      
    yTouch.current = e.touches[0].clientY;                                      
  }
                                                                          
  function handleTouchMove(e:any) {
      if ( !xTouch.current || !yTouch.current ) return;

      const xUp = e.touches[0].clientX;                                    
      const yUp = e.touches[0].clientY;

      const xDiff = xTouch.current - xUp;
      const yDiff = yTouch.current - yUp;
                                                                          
      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
          if ( xDiff > 0 ) {
              /* right swipe */ 
              if (page.current == 3) return
              move(page.current + 1)
          } else {
              /* left swipe */
              if (page.current == 1) return
              move(page.current - 1)
          }                       
      } else {
          if ( yDiff > 0 ) {
              /* down swipe */ 
          } else { 
              /* up swipe */
          }                                                                 
      }
      /* reset values */
      xTouch.current = 0;
      yTouch.current = 0;                                             
  }

  function move(col:number){
    if (page.current == col) return
    gust(page.current, col)
    if (col == 1) {
      page.current = 1
      setTextWidth({gridTemplateColumns: "90% 5% 5%"})
      setT1Style({background: "rgba(0,0,0,0"})
      setT2Style({background: "rgba(0,0,0,0.1"})
      setT3Style({background: "rgba(0,0,0,0.2"})
    }
    else if (col == 2) {
      page.current = 2
      setTextWidth({gridTemplateColumns: "5% 90% 5%"})
      setT1Style({background: "rgba(0,0,0,0.1"})
      setT2Style({background: "rgba(0,0,0,0"})
      setT3Style({background: "rgba(0,0,0,0.1"})
    }
    else if (col == 3) {
      page.current = 3
      setTextWidth({gridTemplateColumns: "5% 5% 90%"})
      setT1Style({background: "rgba(0,0,0,0.2"})
      setT2Style({background: "rgba(0,0,0,0.1"})
      setT3Style({background: "rgba(0,0,0,0"})
    }
  }

  function gust(from:number, to:number){
    if (from > to) gustTarget.current = -1;
    else gustTarget.current = 1;
  }

  function makeLeaves(){
    const leaves:ReactElement[] = []
    for (let i = 0; i < 60; i++) {
      const depth = Math.random() + 0.5;
      const wh = window.innerHeight / 100;
      const fallSpeed = Math.random() * wh + wh - (wh / 2) * depth;
      const startTop = Math.random() * -fallSpeed;
      const leftPos = Math.random() * 100 + '%';
      const leafClass = leafClasses[Math.floor(Math.random() * 2)]
      const spin = leafSpins[Math.floor(Math.random() * 3)]
      const move = leafMoves[Math.floor(Math.random() * 3)]
      const spinSpeed = Math.random() * 3 + 4 + 's'
      const moveSpeed = Math.random() * 4 + 5 + 's'
      leaves[i] = <div className="leafContainer" id={`leaf${i}`} key={i} style={{animationDuration:fallSpeed+'s', animationDelay:startTop+'s', transform:`scale(${depth})`, zIndex:Math.floor((depth - 0.5) * 10) + 1, left:leftPos}}>
        <div className={leafClass} style={{animationName:`${spin}, ${move}`, animationDuration:`${spinSpeed}, ${moveSpeed}`, filter:`blur(${depth * 3 - 2}px)`}}></div>
      </div>
    }
    setRenderLeaves([...leaves])
  }

  // function mouseCoords(e:MouseEvent){
  //   mousePos.current = e.clientX
  // }
  // function handleOrientation(e:any){
  //   if(e.rotationRate.gamma) mousePos.current = Math.round(mousePos.current + e.rotationRate.gamma / 5)
  // }

  function animate(now:number){
    if (!active.current) return
    now *= 0.01;
    const deltaTime = now - lastRender.current;
    lastRender.current = now;
    if (deltaTime) { //skips evaluations if no time has passed since last call (which strangely does happen)
      if (Math.abs(gustTarget.current) > 0) gustSpeed.current += gustTarget.current * 0.5;
      if (Math.abs(gustSpeed.current) > 3 && gustTarget.current) gustTarget.current = 0; 
      else if (Math.abs(gustSpeed.current) > 0.005) gustSpeed.current *= 0.95
      else gustSpeed.current = 0
      for (let i = 0; i < 60; i++) {
        let myLeaf = document.getElementById(`leaf${i}`)
        if (myLeaf) {
          let left = parseFloat(myLeaf.style.left.substring(0, myLeaf.style.left.length - 1))
          let leftMove = left - (gustSpeed.current * 2 * (parseFloat(myLeaf.style.zIndex + i / 10) / 30)) // i / 10 gives it a "random" but constant multiplier for each leaf
          if (leftMove > 100) leftMove -= 105
          if (leftMove < -5) leftMove += 105
          myLeaf.style.left = `${leftMove}%`
        }
      }
    }
    if (active.current) setTimeout(() => requestAnimationFrame((now) => animate(now)), 16)
  }

  
  return <section id="Contact">
    <div className="text" style={textWidth}>
      <div className="t1" onMouseOver={e => move(1)}>
        <div style={t1Style}>
          Please note that this folio site is a work in progress, the site itself is my folio, as well as a handful of projects in the Projects section.
          <br/><br/>
          That includes the below.  I'll rewrite this soon, but this is what I was thinking a year ago:
          <br/><br/>
          Over a decade ago I finished a degree in 3D animation. I learnt two very important things during my course:
          <br/><br/>
          1: I LOVE the technical side of animation, and<br/>
          2: Animation is not for me.
        </div>
      </div>
      <div className="t2" onMouseOver={e => move(2)}>
        <div style={t2Style}>
          I'm an extremely technically minded person, and can never have enough problems to solve. While I definitely have a creative side, I discovered that I don't have that artistic PASSION that's required in such a competitive industry, not like I do for coding, scripting and automation.
          <br/><br/>
          I've played around with code my whole life, and even made my own Google Maps API integrated webtools to make my job easier in my last three roles. But it wasn't until my last position was made redundant that I went "hang on, this pay-out will keep me afloat for a little while, maybe I *don't* have to just jump into the next available position".
        </div>
      </div>
      <div className="t3" onMouseOver={e => move(3)}>
        <div style={t3Style}>
          So I did some serious research and introspection. I even took two or three personality tests! I'm still not entirely sure I believe in them entirely, but they all gave me the same answers, and those answers felt like quite an accurate representation of how my mind works. One of the top suggested careers for people with my personality type was software engineer, so I looked into what a software engineer actually does, and I honestly felt like I didn't even have an option any more. I HAD to pursue this.
          <br/><br/>
          So I found a bootcamp that would help me solidify the skills I already had and add a few more to my repertoire, and jumped! Having now completed that course, I can confidently say that I'm ready for action!
        </div>
      </div>
      <div className="textTop"></div>
    </div>
    <div className="treeEffects">
      {renderLeaves}
    </div>
  </section>
}