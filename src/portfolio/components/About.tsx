import { useEffect, useRef, useState } from "react";
import "./CSS/about.css"

type Props = {turnToCheat: number;}

export default function About({turnToCheat}: Props){

  // const [squish, setSquish] = useState<number>(1);
  // const [order, setOrder] = useState<string[]>(["a1", "a2", "a3", "a4", "a5", "a6", "a7"]);
  const active = useRef<boolean>(false);
  let squish:number = 1;
  let order:string[] = ["a1", "a2", "a3", "a4", "a5", "a6", "a7"];
  let speed:number = 1;
  let direction:number = 1;
  let mousePosX = useRef<number>(0);
  let mousePosY = useRef<number>(0);
  let lastMousePos:number = 0;
  let clickedMousePos:number = 0;
  let clickTarget:number = 0;
  let hoverTarget:number = 0;
  let prevHover:number = 0;
  let lastTime:number = 0;
  const checked = useRef<number>(0);
  let tempChecked:number = 0;
  let toCheck:HTMLInputElement|null = null;
  let reset:ReturnType<typeof requestAnimationFrame>;
  const posXAdj = useRef<number[]>([0, 0, 0, 0, 0, 0, 0])
  const posYAdj = useRef<number[]>([0, 0, 0, 0, 0, 0, 0])
  const posLerp = useRef<number[]>([0, 0, 0, 0, 0, 0, 0])
  const magLerp = useRef<number[]>([1, 1, 1, 1, 1, 1, 1])
  const lerpReset = useRef<ReturnType<typeof requestAnimationFrame>[]>([0,0,0,0,0,0,0])
  const angleTarget = useRef<number>(0);
  const trans = useRef<number>(1);
  const seventh:number = 100 / 7;
  let squeventh:number = seventh;
  const bg = useRef<string>("")
  const bgOp = useRef<number>(0)
  let bgtimer:ReturnType<typeof setTimeout>;
  let mouseMove = useRef<boolean>(false);
  let tapping = useRef<boolean>(false);

  // const xTouch = useRef<number>(0);
  // const yTouch = useRef<number>(0);

  const [contStyle, setContStyle] = useState<object>({ gridTemplateAreas: `"${order[0]} ${order[1]} ${order[2]} ${order[3]} ${order[4]} ${order[5]} ${order[6]}"`, gridTemplateColumns: `${squish}fr 1fr 1fr 1fr 1fr 1fr ${1 - squish}fr` })
  const [a1Pos, setA1Pos] = useState<object>({backgroundPosition: "50% 50%"})
  const [a2Pos, setA2Pos] = useState<object>({backgroundPosition: "50% 50%"})
  const [a3Pos, setA3Pos] = useState<object>({backgroundPosition: "50% 50%"})
  const [a4Pos, setA4Pos] = useState<object>({backgroundPosition: "50% 50%"})
  const [a5Pos, setA5Pos] = useState<object>({backgroundPosition: "50% 50%"})
  const [a6Pos, setA6Pos] = useState<object>({backgroundPosition: "50% 50%"})
  const [a7Pos, setA7Pos] = useState<object>({backgroundPosition: "50% 50%"})
  const [a1Angle, setA1Angle] = useState<object>({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
  const [a2Angle, setA2Angle] = useState<object>({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
  const [a3Angle, setA3Angle] = useState<object>({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
  const [a4Angle, setA4Angle] = useState<object>({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
  const [a5Angle, setA5Angle] = useState<object>({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
  const [a6Angle, setA6Angle] = useState<object>({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
  const [a7Angle, setA7Angle] = useState<object>({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})

  useEffect(() => {
    if (turnToCheat == 3){
      active.current = true;
      requestAnimationFrame(slide)
      window.addEventListener('mousemove', mouseCoords, false); // This needs some serious work for mobile devices.
      // window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousedown', function(e:any) {
        if (e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
        }
        handleMouseDown(e)
      }, false)
      window.addEventListener('mouseup', handleMouseUp, false);
      window.addEventListener('touchstart', handleMouseDown, false);        
      window.addEventListener('touchmove', mouseCoords, false);
      window.addEventListener('touchend', handleMouseUp, false);
    }
    else{
      active.current = false;
      window.removeEventListener('mousemove', mouseCoords, false);
      window.removeEventListener('mousedown', handleMouseDown, false);
      window.removeEventListener('mouseup', handleMouseUp, false);
      window.removeEventListener('touchstart', handleMouseDown, false);        
      window.removeEventListener('touchmove', mouseCoords, false);
      window.removeEventListener('touchend', handleMouseUp, false);
    }
    return () =>{
      window.removeEventListener('mousemove', mouseCoords, false);
      window.removeEventListener('mousedown', handleMouseDown, false);
      window.removeEventListener('mouseup', handleMouseUp, false);
      window.removeEventListener('touchstart', handleMouseDown, false);        
      window.removeEventListener('touchmove', mouseCoords, false);
      window.removeEventListener('touchend', handleMouseUp, false);
    }
  }, [turnToCheat])

  function handleMouseDown(e:any){
    if (tapping.current) return
    if (e.type == "touchstart") {
      setTimeout(() => {
        tapping.current = false;
      }, 100)
      tapping.current = true;
      lastMousePos = e.touches[0].clientX
    }
    mousePosX.current = ("clientX" in e) ? e.clientX : e.touches[0].clientX;
    clickedMousePos = ("clientX" in e) ? e.clientX : e.touches[0].clientX;
    clickTarget = getTarget(e)
    if (clickTarget != checked.current) {
      uncheck()
    }
    if (clickTarget > 0 && clickTarget < 8) tempChecked = clickTarget
  }
  function handleMouseUp(e:any){
    if (tapping.current && e.type == "mouseup") return
    const thisCheck:number = getTarget(e)
    if (thisCheck == checked.current) uncheck()
    else if (thisCheck == tempChecked && Math.abs(mousePosX.current - clickedMousePos) < 15){
      toCheck = e.target.previousElementSibling
      if (toCheck) {
        toCheck.checked = true
        checked.current = thisCheck;
        cancelAnimationFrame(lerpReset.current[thisCheck - 1])
        window.requestAnimationFrame(t => lerpUp(t, t, thisCheck, thisCheck))
        clearTimeout(bgtimer)
        bg.current = "b" + checked.current
        bgOp.current = 1
      }
    }
    if (Math.abs(mousePosX.current - clickedMousePos) > 30) uncheck()
    clickTarget = 0;
    mousePosX.current = ("clientX" in e) ? e.clientX : e.changedTouches[0].clientX;
  }

  function mouseCoords(e:any){
    mousePosX.current = ("clientX" in e) ? e.clientX : e.touches[0].clientX;
    mousePosY.current = ("clientY" in e) ? e.clientY : e.touches[0].clientY;
    if (!e.sourceCapabilities.firesTouchEvents){
      hoverTarget = getTarget(e);
      mouseMove.current = true;
    }
    else mouseMove.current = false;
  }

  function getTarget(e:any){
    if (e.target.classList.contains("item")) return 8;
    else if (e.target.classList.contains("c")) return parseInt(e.target.parentElement.className.substring(6));
    else return 0;
  }
  function uncheck(){
    // let temp:HTMLInputElement|null = document.querySelector('input[name="cards"]:checked')
    if (toCheck) {
      toCheck.checked = false
      toCheck = null
      bgtimer = setTimeout(() => bg.current = "", 1000)
      bgOp.current = 0
    }
    const temp = checked.current
    window.requestAnimationFrame(t => lerpDown(t, t, temp, posXAdj.current[checked.current - 1], posYAdj.current[checked.current - 1], 2))
    checked.current = 0
  }

  function startAngle(e:any, card:number){
    if (!mouseMove.current) return
    angleTarget.current = card;
    cancelAnimationFrame(lerpReset.current[card - 1])
    window.requestAnimationFrame(t => {
      changeAngle(e, card);
      lerpUp(t, t, card, checked.current)
    });
  }
  function changeAngle(e:any, card:number){
    if (card == angleTarget.current){
      const rect = e.target.getBoundingClientRect();
      const w = rect.width / 2
      const h = rect.height / 2
      if (trans.current > 0) trans.current *= 0.95
      const angle = {transform: `rotateX(${(mousePosY.current - rect.y - h) / h * -10}deg) rotateY(${(mousePosX.current - rect.x - w) / w * 10}deg)`, transition: `all 1s, transform ${trans.current}s`}
      posXAdj.current[card - 1] = (mousePosX.current - rect.x - w) / w * 5
      posYAdj.current[card - 1] = (mousePosY.current - rect.y - h) / h * 5
      if (card == 1) setA1Angle(angle)
      else if (card == 2) setA2Angle(angle)
      else if (card == 3) setA3Angle(angle)
      else if (card == 4) setA4Angle(angle)
      else if (card == 5) setA5Angle(angle)
      else if (card == 6) setA6Angle(angle)
      else if (card == 7) setA7Angle(angle)
      reset = window.requestAnimationFrame(t => changeAngle(e, card))
    }
  }
  function resetAngle(card:number){
    angleTarget.current = 0;
    trans.current = 1;
    cancelAnimationFrame(lerpReset.current[card - 1]);
    window.requestAnimationFrame(t => lerpDown(t, t, card, posXAdj.current[card - 1], posYAdj.current[card - 1], checked.current == card ? 1 : 0))
    cancelAnimationFrame(reset);
    if (card == 1) setA1Angle({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
    if (card == 2) setA2Angle({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
    if (card == 3) setA3Angle({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
    if (card == 4) setA4Angle({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
    if (card == 5) setA5Angle({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
    if (card == 6) setA6Angle({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
    if (card == 7) setA7Angle({transform: "rotateX(0deg) rotateY(0deg)", transition: "all 1s, transform 1s"})
  }

  function lerpUp(ts:number, lt:number, card:number, checked:number){
    if (posLerp.current[card - 1] < 1 || checked == card && (posLerp.current[card - 1] < 1 || magLerp.current[card - 1] < 10)){
      if (posLerp.current[card - 1] < 1)
        posLerp.current[card - 1] += ((ts - lt) / 1000)
      else if (posLerp.current[card - 1] != 1)
        posLerp.current[card - 1] = 1
      if (checked == card) {
        if (magLerp.current[card - 1] < 10)
          magLerp.current[card - 1] += ((ts - lt) / 500) * 10
        else if (magLerp.current[card - 1] != 10)
          magLerp.current[card - 1] = 10
      }
      lerpReset.current[card - 1] = window.requestAnimationFrame(t => lerpUp(t, ts, card, checked))
    }
    else {
      posLerp.current[card - 1] = 1
      if (checked == card) magLerp.current[card - 1] = 10
    }
  }
  function lerpDown(ts:number, lt:number, card:number, x:number, y:number, checked:number){
    if (posLerp.current[card - 1] > 0 || checked > 0 && (posLerp.current[card - 1] > 0 || magLerp.current[card - 1] > 1)){
      if (posLerp.current[card - 1] > 0 && checked < 2)
        posLerp.current[card - 1] -= (ts - lt) / 500
      else if (posLerp.current[card - 1] != 0 && checked < 2)
        posLerp.current[card - 1] = 0
      if (checked > 0 && magLerp.current[card - 1] > 1)
        magLerp.current[card - 1] -= (ts - lt) / 1000 * 10
      else if (magLerp.current[card - 1] != 1)
        magLerp.current[card - 1] = 1
      lerpReset.current[card - 1] = window.requestAnimationFrame(t => lerpDown(t, ts, card, x, y, checked))
    }
    else {
      if (checked < 2){
        posLerp.current[card - 1] = 0
        posXAdj.current[card - 1] = 0
        posYAdj.current[card - 1] = 0
      }
      magLerp.current[card - 1] = 1
    } 
  }

  function slide(timeStamp:number){
    if(timeStamp - lastTime > 16) {
      lastTime = timeStamp;
      if (clickTarget) speed = (mousePosX.current - lastMousePos) / 2
      else if (checked.current){
        const cc:string = "a" + checked.current
        if (order[0] == cc || order[1] == cc || order[2] == cc) speed = 5
        else if (order[4] == cc || order[5] == cc || order[6] == cc) speed = -5
        else if (Math.abs(speed) > 2) speed *= 0.8
        else {
          if (squish > 0.55) speed = -2
          else if (squish < 0.45) speed = 2
          else speed = 0;
        }
      }
      else if (hoverTarget && Math.abs(speed) > 0.5) speed *= 0.95
      else if (Math.abs(speed) > 1.1) speed *= 0.99
      else if (Math.abs(speed) < 1) speed += speed < 0 || direction < 0 ? -0.015 : 0.015;
      if (speed < 0) direction = -1
      else if ( speed > 0) direction = 1
      if (Math.abs(speed) > 0.05){
        squish += (speed / 120) // this is what ultimately controls the speed
        if (squish < 0){
          squish = 1;
          order.push(order.shift() as string)
        }
        if (squish > 1){
          squish = 0; 
          order.unshift(order.pop() as string)
        }
        setContStyle({ gridTemplateAreas: `"${order[0]} ${order[1]} ${order[2]} ${order[3]} ${order[4]} ${order[5]} ${order[6]}"`, gridTemplateColumns: `${squish}fr 1fr 1fr 1fr 1fr 1fr ${1 - squish}fr` })
        squeventh = seventh * squish
      }
      setA1Pos({backgroundPosition: `${seventh * (7 - parseInt(order[6].substring(1))) + squeventh + (posXAdj.current[0] * posLerp.current[0] * magLerp.current[0])}% ${50 + (posYAdj.current[0] * posLerp.current[0] * magLerp.current[0])}%`})
      setA2Pos({backgroundPosition: `${seventh * (7 - parseInt(order[5].substring(1))) + squeventh + (posXAdj.current[1] * posLerp.current[1] * magLerp.current[1])}% ${50 + (posYAdj.current[1] * posLerp.current[1] * magLerp.current[1])}%`})
      setA3Pos({backgroundPosition: `${seventh * (7 - parseInt(order[4].substring(1))) + squeventh + (posXAdj.current[2] * posLerp.current[2] * magLerp.current[2])}% ${50 + (posYAdj.current[2] * posLerp.current[2] * magLerp.current[2])}%`})
      setA4Pos({backgroundPosition: `${seventh * (7 - parseInt(order[3].substring(1))) + squeventh + (posXAdj.current[3] * posLerp.current[3] * magLerp.current[3])}% ${50 + (posYAdj.current[3] * posLerp.current[3] * magLerp.current[3])}%`})
      setA5Pos({backgroundPosition: `${seventh * (7 - parseInt(order[2].substring(1))) + squeventh + (posXAdj.current[4] * posLerp.current[4] * magLerp.current[4])}% ${50 + (posYAdj.current[4] * posLerp.current[4] * magLerp.current[4])}%`})
      setA6Pos({backgroundPosition: `${seventh * (7 - parseInt(order[1].substring(1))) + squeventh + (posXAdj.current[5] * posLerp.current[5] * magLerp.current[5])}% ${50 + (posYAdj.current[5] * posLerp.current[5] * magLerp.current[5])}%`})
      setA7Pos({backgroundPosition: `${seventh * (7 - parseInt(order[0].substring(1))) + squeventh + (posXAdj.current[6] * posLerp.current[6] * magLerp.current[6])}% ${50 + (posYAdj.current[6] * posLerp.current[6] * magLerp.current[6])}%`})
    }
    if (active.current) window.requestAnimationFrame(slide);
    lastMousePos = mousePosX.current;
  }


  const header1:string = "Headline About Image"
  const header2:string = "Longer Headline About Image for Two Lines"
  const header3:string = "Different Headline"
  const header4:string = "Is this even a headline?"
  const header5:string = "What Is This Headline Anyway?"
  const header6:string = "Need to Know More?"
  const header7:string = "Are You Sure You Want to Click on This?"
  const desc1:string = "What's Spanish for 'I know you speak English?' There's so many poorly chosen words in that sentence. But I bought a yearbook ad from you, doesn't that mean anything anymore?"
  const desc2:string = "When I held that gun in my hand, I felt a surge of power… like God must feel when he's holding a gun. And now, in the spirit of the season: start shopping. And for every dollar of Krusty merchandise you buy, I will be nice to a sick kid. For legal purposes, sick kids may include hookers with a cold."
  const desc3:string = "Aww, gee, you got me there, Rick. It's a figure of speech, Morty! They're bureaucrats! I don't respect them. Just keep shooting, Morty! You have no idea what prison is like here!"
  const desc4:string = "I was part of something special. Eventually, you do plan to have dinosaurs on your dinosaur tour, right? Jaguar shark! So tell me - does it really exist?"
  const desc5:string = "I'm sorry, guys. I never meant to hurt you. Just to destroy everything you ever believed in. Doomsday device? Ah, now the ball's in Farnsworth's court! Bender, quit destroying the universe! Goodbye, friends. I never thought I'd die like this. But I always really hoped."
  const desc6:string = "As a scientist, I want to go to Mars and back to asteroids and the Moon because I'm a scientist. But I can tell you, I'm not so naive a scientist to think that the nation might not have geopolitical reasons for going into space."
  const desc7:string = "Ni! Ni! Ni! Ni! Oh! Come and see the violence inherent in the system! Help, help, I'm being repressed! On second thoughts, let's not go there. It is a silly place. Bring her forward!"


  return <section id="About">
    <div className={`backGround ${bg.current}`} style={{opacity: bgOp.current}}></div>
    <div id="cont" onDragStart={e => e.preventDefault} onDrop={e => e.preventDefault} style={contStyle}>
      <div className="item a1">
        <input id="a1" type="radio" name="cards" />
        <div className="c card" onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 1)} onMouseLeave={e => resetAngle(1)} style={a1Angle}>
          <div className="c cardImage" style={a1Pos}></div>
          <div className="c cardDesc">
            <div className="c h3"><h3>{header1}</h3><p>{desc1}</p></div>
          </div>
        </div>
      </div>
      <div className="item a2">
        <input id="a2" type="radio" name="cards" />
        <div className="c card" onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 2)} onMouseLeave={e => resetAngle(2)} style={a2Angle}>
          <div className="c cardImage" style={a2Pos}></div>
          <div className="c cardDesc">
            <div className="c h3"><h3>{header2}</h3><p>{desc2}</p></div>
          </div>
        </div>
      </div>
      <div className="item a3">
        <input id="a3" type="radio" name="cards" />
        <div className="c card" onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 3)} onMouseLeave={e => resetAngle(3)} style={a3Angle}>
          <div className="c cardImage" style={a3Pos}></div>
          <div className="c cardDesc">
            <div className="c h3"><h3>{header3}</h3><p>{desc3}</p></div>
          </div>
        </div>
      </div>
      <div className="item a4">
        <input id="a4" type="radio" name="cards" />
        <div className="c card" onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 4)} onMouseLeave={e => resetAngle(4)} style={a4Angle}>
          <div className="c cardImage" style={a4Pos}></div>
          <div className="c cardDesc">
            <div className="c h3"><h3>{header4}</h3><p>{desc4}</p></div>
          </div>
        </div>
      </div>
      <div className="item a5">
        <input id="a5" type="radio" name="cards" />
        <div className="c card" onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 5)} onMouseLeave={e => resetAngle(5)} style={a5Angle}>
          <div className="c cardImage" style={a5Pos}></div>
          <div className="c cardDesc">
            <div className="c h3"><h3>{header5}</h3><p>{desc5}</p></div>
          </div>
        </div>
      </div>
      <div className="item a6">
        <input id="a6" type="radio" name="cards" />
        <div className="c card" onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 6)} onMouseLeave={e => resetAngle(6)} style={a6Angle}>
          <div className="c cardImage" style={a6Pos}></div>
          <div className="c cardDesc">
            <div className="c h3"><h3>{header6}</h3><p>{desc6}</p></div>
          </div>
        </div>
      </div>
      <div className="item a7">
        <input id="a7" type="radio" name="cards" />
        <div className="c card" onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 7)} onMouseLeave={e => resetAngle(7)} style={a7Angle}>
          <div className="c cardImage" style={a7Pos}></div>
          <div className="c cardDesc">
            <div className="c h3"><h3>{header7}</h3><p>{desc7}</p></div>
          </div>
        </div>
      </div>
    </div>
    {/* <a href="https://www.linkedin.com/in/james-blaskett/">LinkedIn</a><br/><br/>
    <a href="mailto:jmblasket@gmail.com" target="_blank">Email</a> */}
  </section>
}
