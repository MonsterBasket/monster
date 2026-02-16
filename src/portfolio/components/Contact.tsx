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
          Is this a typical website? No.<br/>
          If I made your website, would it be like this? Probably not.
          <br/><br/>
          But this website wasn't made to sell websites, it was made to show off my ability to create unique, interactive elements that—hopefully—you've never seen before.
          <br/><br/>
          So have a look around, everything on this site was made from scratch!  Maybe you'll see some things you like, some incorporated into the site itself, others linked to some other work I've done.  Also, if you continue reading you'll learn a little about me too, and how I became a game developer and web developer.  (Proceed at your own risk! →)
        </div>
      </div>
      <div className="t2" onMouseOver={e => move(2)}>
        <div style={t2Style}>
          Compared to most people entering either the game dev or web dev industries, I'm a little longer in tooth, and there are numerous reasons why it's taken me this long to take this seriously.
          <br/><br/>
          Growing up in Tassie, I did a 3D animation subject in year 12 and had my name down for a scholarship with ABC.  When they cancelled the scholarship program, I enrolled instead in a Bachelor of Computer Science at University of Tasmania, but dropped out after a semester of not knowing why I was there.
          <br/><br/>
          Then in 2003 I took a flight to the big city of Melbourne to attend the International Game Developers Conference.  I was young, very shy, and knew nothing.  I made no contacts at the conference, learnt essentially nothing, and only cemented my preconception that the industry was uninviting and an impossible pipe dream.
          <br/><br/>
          Several years of doing nothing with my life later, I moved to Melbourne and completed a Bachelor of Creative Arts (Animation) at JMC Academy.  Loved it, excelled in my class, did a few freelance gigs, but then ultimately let imposter syndrome beat me down.
        </div>
      </div>
      <div className="t3" onMouseOver={e => move(3)}>
        <div style={t3Style}>
          After being made redundant from what I'd resigned myself to be my life-long career—because it paid well, not because I particularly enjoyed it—I did a software engineering bootcamp, and successfully transitioned into a software engineering role at Gentrack.  More than 20 years after dropping out of comp sci...
          <br/><br/>
          I was so sure of my decision, I'd done a lot of research and personality tests and software engineering really felt like the right choice, but after about a year I realised I wasn't enjoying my work at all.  This sent me into depression, and I started therapy for the first time in my life. Boy do I wish I'd started it back when I was a teenager.  It's now very clear to me that my multiple failures to persevere with things were due to the depression that has plagued me since High School.
          <br/><br/>
          Now, with my mental health tools in hand, I know that I was right about software development, I just have no love for billing or the energy industry.  Gentrack is a great place to work, just not for me.
          <br/><br/>
          Now that I'm in the best state of mind I've been in for my entire life, I'm here looking for frontend dev work, doing freelance web design, and making my own game!
        </div>
      </div>
      <div className="textTop"></div>
    </div>
    <div className="treeEffects">
      {renderLeaves}
    </div>
  </section>
}