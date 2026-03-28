import { ReactElement, useEffect, useRef, useState } from "react";
import "./CSS/pens.css"
import Pen1 from "../pens/checkmate/checkmate"
import Pen2 from "../pens/commonSense/commonSense"
import Pen3 from "../pens/concentric/concentric"
import Pen4 from "../pens/spotlight/spotlight"
import Pen5 from "../pens/tired/tired"
import Pen6 from "../pens/tobeornot/tobeornot"
import Pen7 from "../pens/underneath/underneath"

type Props = {turnToCheat: number;}

export default function Pens({turnToCheat}: Props){

  // const [squish, setSquish] = useState<number>(1);
  // const [order, setOrder] = useState<string[]>(["a1", "a2", "a3", "a4", "a5", "a6", "a7"]);
  const active = useRef<boolean>(false);
  let squish:number = 1;
  let order:string[] = ["a1", "a2", "a3", "a4", "a5", "a6", "a7"];
  let speed:number = 1;
  let direction:number = 1;
  let mX = useRef<number>(0);
  let mY = useRef<number>(0);
  const [zX, setzX] = useState<number>(0)
  const [zY, setzY] = useState<number>(0)
  let lastMousePos:number = 0;
  let clickedMousePos:number = 0;
  let clickTarget:number = 0;
  let hoverTarget:number = 0;
  let lastTime:number = 0;
  const checked = useRef<number>(0);
  const shown = useRef<boolean[]>([false, false, false, false, false, false, false, false])
  const shownOp = useRef<number[]>([0, 0, 0, 0, 0, 0, 0, 0])
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
  const bg = useRef<ReactElement|null>(null)
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
      window.addEventListener('scroll', uncheck, false);
    }
    else{
      uncheck()
      active.current = false;
      window.removeEventListener('mousemove', mouseCoords, false);
      window.removeEventListener('mousedown', function(e:any) {
        if (e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
        }
        handleMouseDown(e)
      }, false)
      window.removeEventListener('mouseup', handleMouseUp, false);
      window.removeEventListener('touchstart', handleMouseDown, false);        
      window.removeEventListener('touchmove', mouseCoords, false);
      window.removeEventListener('touchend', handleMouseUp, false);
      window.removeEventListener('scroll', uncheck, false);
    }
    return () =>{
      window.removeEventListener('mousemove', mouseCoords, false);
      window.removeEventListener('mousedown', function(e:any) {
        if (e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
        }
        handleMouseDown(e)
      }, false)
      window.removeEventListener('mouseup', handleMouseUp, false);
      window.removeEventListener('touchstart', handleMouseDown, false);        
      window.removeEventListener('touchmove', mouseCoords, false);
      window.removeEventListener('touchend', handleMouseUp, false);
      window.removeEventListener('scroll', uncheck, false);
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
    mX.current = ("clientX" in e) ? e.clientX : e.touches[0].clientX;
    clickedMousePos = ("clientX" in e) ? e.clientX : e.touches[0].clientX;
    clickTarget = getTarget(e)
    if (clickTarget != checked.current && clickTarget != 0 && clickTarget != 8) {
      uncheck()
    }
    if (clickTarget > 0 && clickTarget < 8) tempChecked = clickTarget
  }
  function handleMouseUp(e:any){
    if (tapping.current && e.type == "mouseup") return
    const thisCheck:number = getTarget(e)
    if (thisCheck == checked.current) uncheck();
    else if (thisCheck == tempChecked && Math.abs(mX.current - clickedMousePos) < 15){
      toCheck = e.target.previousElementSibling
      if (toCheck) {
        toCheck.checked = true
        checked.current = thisCheck;
        cancelAnimationFrame(lerpReset.current[thisCheck - 1])
        window.requestAnimationFrame(t => lerpUp(t, t, thisCheck, thisCheck))
        clearTimeout(bgtimer)
        bgOp.current = 1
      }
    }
    if (Math.abs(mX.current - clickedMousePos) > 30 && thisCheck > 0 && thisCheck < 8) uncheck()
    clickTarget = 0;
    mX.current = ("clientX" in e) ? e.clientX : e.changedTouches[0].clientX;
  }

  function mouseCoords(e:any){
    mX.current = ("clientX" in e) ? e.clientX : e.touches[0].clientX;
    mY.current = ("clientY" in e) ? e.clientY : e.touches[0].clientY;
    setzX(e.clientX)
    setzY(e.clientY)
    if (!e.sourceCapabilities.firesTouchEvents){
      hoverTarget = getTarget(e);
      mouseMove.current = true;
    }
    else mouseMove.current = false;
  }

  function getTarget(e:any){
    if (e.target.classList.contains("item")) return 8;
    else if (e.target.classList.contains("PTc")) return parseInt(e.target.parentElement.className.substring(6));
    else return 0;
  }
  function uncheck(){
    // let temp:HTMLInputElement|null = document.querySelector('input[name="cards"]:checked')
    if (toCheck) {
      toCheck.checked = false
      toCheck = null
      bgtimer = setTimeout(() => bg.current = null, 1000)
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
      const angle = {transform: `rotateX(${(mY.current - rect.y - h) / h * -10}deg) rotateY(${(mX.current - rect.x - w) / w * 10}deg)`, transition: `all 1s, transform ${trans.current}s`}
      posXAdj.current[card - 1] = (mX.current - rect.x - w) / w * 5
      posYAdj.current[card - 1] = (mY.current - rect.y - h) / h * 5
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
      if (clickTarget) speed = (mX.current - lastMousePos) / 2
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
    else uncheck();
    lastMousePos = mX.current;
  }


  const header1:string = "Checkmate"
  const header2:string = "Common Sense"
  const header3:string = "Concentric"
  const header4:string = "Spotlight"
  const header5:string = "Tired"
  const header6:string = "To Be or Not To Be"
  const header7:string = "Mad"
  const desc1:string = "Experimenting with a hover interacton that dynamically reveals multiple background artworks."
  const desc2:string = "Experimenting with a hover interaction that aims to add a layer of depth to the homepage message, revealing a hidden meaning as you explore."
  const desc3:string = "Experimenting with continuous motion - the background artwork responds to your cursor movement, creating a dynamic canvas."
  const desc4:string = "An experiment where the flashlight follows your mouse guiding your attention through the list. I think it's more fun when digital experiences are inspired by real-life actions. 🔦"
  const desc5:string = "Experimenting with hover interaction that creates a unique marquee animation every time your cursor moves. The overlapping lines build up to form a unique design every time."
  const desc6:string = "This hover interaction brings Hamlet's famous question to life. The skull turns to follow your mouse as you ponder: To be or not to be?"
  const desc7:string = "This hover interaction reveals an animated background that slowly fades away. It's all about adding a touch of surprise and delight to the user experience. ✨"

  useEffect(() =>{
    for(let i=0; i < shown.current.length; i++){
      if (i === checked.current) {
        shown.current[i] = true;
        setTimeout((i) => shownOp.current[i] = 1, 0, i)
      }
      else {
        shownOp.current[i] = 0;
        setTimeout((i) => {
        shown.current[i] = i === checked.current ? true : false}
        , 1000, i)
      }
    }
  }, [checked.current])

  return <section id="Pens">
    {shown.current[1] && <div className={`backGround PTbgOp${shownOp.current[1]}`}><Pen1 mX={zX} mY={zY}/></div>}
    {shown.current[2] && <div className={`backGround PTbgOp${shownOp.current[2]}`}><Pen2 mX={zX} mY={zY}/></div>}
    {shown.current[3] && <div className={`backGround PTbgOp${shownOp.current[3]}`}><Pen3 mX={zX} mY={zY}/></div>}
    {shown.current[4] && <div className={`backGround PTbgOp${shownOp.current[4]}`}><Pen4 mX={zX} mY={zY}/></div>}
    {shown.current[5] && <div className={`backGround PTbgOp${shownOp.current[5]}`}><Pen5 mX={zX} mY={zY}/></div>}
    {shown.current[6] && <div className={`backGround PTbgOp${shownOp.current[6]}`}><Pen6 mX={zX} mY={zY}/></div>}
    {shown.current[7] && <div className={`backGround PTbgOp${shownOp.current[7]}`}><Pen7 mX={zX} mY={zY}/></div>}
    <div id="cont" onDragStart={e => e.preventDefault} onDrop={e => e.preventDefault} style={contStyle}>
      <div className={"item a1"}>
        <input id="a1" type="radio" name="cards" />
        <div className={"PTc card"} onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 1)} onMouseLeave={e => resetAngle(1)} style={a1Angle}>
          <div className="PTc cardImage" style={a1Pos}></div>
          <div className="PTc cardDesc">
            <div className="PTc h3"><h3>{header1}</h3><p>{desc1}</p></div>
          </div>
        </div>
      </div>
      <div className={"item a2"}>
        <input id="a2" type="radio" name="cards" />
        <div className={"PTc card"} onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 2)} onMouseLeave={e => resetAngle(2)} style={a2Angle}>
          <div className="PTc cardImage" style={a2Pos}></div>
          <div className="PTc cardDesc">
            <div className="PTc h3"><h3>{header2}</h3><p>{desc2}</p></div>
          </div>
        </div>
      </div>
      <div className={"item a3"}>
        <input id="a3" type="radio" name="cards" />
        <div className={"PTc card"} onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 3)} onMouseLeave={e => resetAngle(3)} style={a3Angle}>
          <div className="PTc cardImage" style={a3Pos}></div>
          <div className="PTc cardDesc">
            <div className="PTc h3"><h3>{header3}</h3><p>{desc3}</p></div>
          </div>
        </div>
      </div>
      <div className={"item a4"}>
        <input id="a4" type="radio" name="cards" />
        <div className={"PTc card"} onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 4)} onMouseLeave={e => resetAngle(4)} style={a4Angle}>
          <div className="PTc cardImage" style={a4Pos}></div>
          <div className="PTc cardDesc">
            <div className="PTc h3"><h3>{header4}</h3><p>{desc4}</p></div>
          </div>
        </div>
      </div>
      <div className={"item a5"}>
        <input id="a5" type="radio" name="cards" />
        <div className={"PTc card"} onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 5)} onMouseLeave={e => resetAngle(5)} style={a5Angle}>
          <div className="PTc cardImage" style={a5Pos}></div>
          <div className="PTc cardDesc">
            <div className="PTc h3"><h3>{header5}</h3><p>{desc5}</p></div>
          </div>
        </div>
      </div>
      <div className={"item a6"}>
        <input id="a6" type="radio" name="cards" />
        <div className={"PTc card"} onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 6)} onMouseLeave={e => resetAngle(6)} style={a6Angle}>
          <div className="PTc cardImage" style={a6Pos}></div>
          <div className="PTc cardDesc">
            <div className="PTc h3"><h3>{header6}</h3><p>{desc6}</p></div>
          </div>
        </div>
      </div>
      <div className={"item a7"}>
        <input id="a7" type="radio" name="cards" />
        <div className={"PTc card"} onClick={e => e.preventDefault} onMouseEnter={e => startAngle(e, 7)} onMouseLeave={e => resetAngle(7)} style={a7Angle}>
          <div className="PTc cardImage" style={a7Pos}></div>
          <div className="PTc cardDesc">
            <div className="PTc h3"><h3>{header7}</h3><p>{desc7}</p></div>
          </div>
        </div>
      </div>
    </div>
    <div className="PTsuz"><a href="https://www.linkedin.com/in/suzanne-sirunyan/" target="_blank" rel="noreferrer">Original Designs by Suz Sirunyan</a></div>
  </section>
}
