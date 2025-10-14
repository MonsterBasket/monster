import { useEffect, useRef, useState } from "react";
import "./CSS/about.css"

export default function About(){

  useEffect(() => {
    window.addEventListener('pointermove', mouseCoords); // This needs some serious work for mobile devices.
    // window.addEventListener('pointerdown', handleMouseDown);
    window.addEventListener('pointerup', handleMouseUp);
    return () => {
      window.removeEventListener('pointermove', mouseCoords); 
      // window.removeEventListener('pointerdown', handleMouseDown);
      window.removeEventListener('pointerup', handleMouseUp);
    };
  }, []);

  const active = useRef<boolean>(true)
  const squish = useRef<number>(1)
  const order = useRef<number[]>([0, 1, 2, 3, 4, 5, 6])
  const speed = useRef<number>(1)
  const mousePos = useRef<number>(0)
  const lastMousePos = useRef<number>(0)
  const clickedMousePos = useRef<number>(0)
  const clickTarget = useRef<number|null>(null)
  const hoverTarget = useRef<boolean>(false)
  const checked = useRef<number|null>(null)
  const seventh = 100 / 7

  const [a1Style, setA1Style] = useState({left: '0%'})
  const [a2Style, setA2Style] = useState({left: '0%'})
  const [a3Style, setA3Style] = useState({left: '0%'})
  const [a4Style, setA4Style] = useState({left: '0%'})
  const [a5Style, setA5Style] = useState({left: '0%'})
  const [a6Style, setA6Style] = useState({left: '0%'})
  const [a7Style, setA7Style] = useState({left: '0%'})

  const radios = {
    a1:useRef<HTMLInputElement | null>(null),
    a2:useRef<HTMLInputElement | null>(null),
    a3:useRef<HTMLInputElement | null>(null),
    a4:useRef<HTMLInputElement | null>(null),
    a5:useRef<HTMLInputElement | null>(null),
    a6:useRef<HTMLInputElement | null>(null),
    a7:useRef<HTMLInputElement | null>(null)
  }
  const keys = Object.keys(radios) as (keyof typeof radios)[];

  function handleMouseDown(e:any, ref:number|null){
    e.preventDefault()
    if (ref == null && clickTarget.current) return // because this fires first from the card and then from the container
    if (ref != checked.current) { 
      uncheck()
    }
    clickTarget.current = ref;
    mousePos.current = e.clientX
    clickedMousePos.current = e.clientX
  }

  function handleMouseUp(e:any){
    e.preventDefault()
    mousePos.current = e.clientX
    let target:number|null = getTarget(e)
    if (target == clickTarget.current && Math.abs(mousePos.current - clickedMousePos.current) < 15){
      checked.current = target
      if (target){
        keys.forEach(key=> {
          if (key == checked.current?.toString()) radios[key].current!.checked = true;
        })
      }
    }
    else if (Math.abs(mousePos.current - clickedMousePos.current) > 30) uncheck()
    else uncheck()
    clickTarget.current = null
  }

  function mouseCoords(e:any){
    if(hoverTarget.current || clickTarget.current) mousePos.current = e.clientX
  }
  function getTarget(e:any){
    if (e.target.classList.contains("item")) return parseInt(e.target.classList[1].substring(1))
    else if (e.target.classList.contains("c")) return parseInt(e.target.parentElement.parentElement.classList[1].substring(1))
    else return null
  }

  function uncheck(){
    keys.forEach(key => {
        radios[key].current!.checked = false;
    })
    checked.current = null
  }

  useEffect(() => {
    if (active.current) requestAnimationFrame(slide)
    return () => {active.current = false}
  }, [active])
  function slide(){
    // let slideCards:HTMLInputElement | null = document.querySelector('input[name="cards"]:checked')
    // if (slideCards) {
    //   setChecked(slideCards as HTMLInputElement)
    // }
    if (checked.current){
      // let cc:string|undefined = checked?.parentElement?.parentElement?.classList[1];
      if (order.current[0] == checked.current || order.current[1] == checked.current || order.current[2] == checked.current){
        speed.current = 5
        console.log("left selected", checked.current)
      } 
      else if (order.current[4] == checked.current || order.current[5] == checked.current || order.current[6] == checked.current) {
        speed.current = -5
        console.log("right selected", checked.current)
      }
      else if (Math.abs(speed.current) > 0.5) speed.current *= 0.8
      else {
        if (squish.current > 0.55) speed.current = -0.5
        else if (squish.current < 0.45) speed.current = 0.5
        else speed.current = 0
      }
    }
    else if (hoverTarget.current && Math.abs(speed.current) > 0.5) speed.current *= 0.95 // reduces speed to 0.5 while hovering anywhere on container
    else if (Math.abs(speed.current) > 1.01) speed.current *= 0.99 // slowly reduces speed to 1 when left alone (after dragging fast)
    else if (Math.abs(speed.current) < 1) speed.current += speed.current < 0 ? -0.015 : 0.015 // increases speed to 1 if left alone
    if (clickTarget.current)
      speed.current = (mousePos.current - lastMousePos.current) / 15 // controls speed while holding down mouse
    if (Math.abs(speed.current) > 0.05){
      squish.current += (speed.current / 10)  // controls movement based on speed
      if (squish.current < 0){
        squish.current = 1
        order.current.unshift(order.current.pop() as number) // loops right most image to left side
      }
      if (squish.current > 1){
        squish.current = 0
        order.current.push(order.current.shift() as number) // opposite of above
      }
      setA1Style({left: `${seventh * order.current[0] + squish.current * seventh}%`})
      setA2Style({left: `${seventh * order.current[1] + squish.current * seventh}%`})
      setA3Style({left: `${seventh * order.current[2] + squish.current * seventh}%`})
      setA4Style({left: `${seventh * order.current[3] + squish.current * seventh}%`})
      setA5Style({left: `${seventh * order.current[4] + squish.current * seventh}%`})
      setA6Style({left: `${seventh * order.current[5] + squish.current * seventh}%`})
      setA7Style({left: `${seventh * order.current[6] + squish.current * seventh}%`})
    }
    setTimeout(() => requestAnimationFrame(slide), 33)
    lastMousePos.current = mousePos.current
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
    <div id="cont" onPointerDown={e => handleMouseDown(e, null)} onDragStart={e => e.preventDefault} onDragEnd={e => e.preventDefault} onMouseEnter={() => {hoverTarget.current = true}} onMouseLeave={() => {hoverTarget.current = false}}>
      <div className="item a1" style={a1Style}>
        <label>
          <input ref={radios.a1} type="radio" name="cards" />
          <div className="c card" onPointerDown={e => handleMouseDown(e, 1)}>
            <div className="c cardImage"></div>
            <div className="c cardDesc">
              <div className="c h3"><h3>{header1}</h3><p>{desc1}</p></div>
            </div>
          </div>
        </label>
      </div>
      <div className="item a2" style={a2Style}>
        <label>
          <input ref={radios.a2} type="radio" name="cards" />
          <div className="c card" onPointerDown={e => handleMouseDown(e, 2)}>
            <div className="c cardImage"></div>
            <div className="c cardDesc">
              <div className="c h3"><h3>{header2}</h3><p>{desc2}</p></div>
            </div>
          </div>
        </label>
      </div>
      <div className="item a3" style={a3Style}>
        <label>
          <input ref={radios.a3} type="radio" name="cards" />
          <div className="c card" onPointerDown={e => handleMouseDown(e, 3)}>
            <div className="c cardImage"></div>
            <div className="c cardDesc">
              <div className="c h3"><h3>{header3}</h3><p>{desc3}</p></div>
            </div>
          </div>
        </label>
      </div>
      <div className="item a4" style={a4Style}>
        <label>
          <input ref={radios.a4} type="radio" name="cards" />
          <div className="c card" onPointerDown={e => handleMouseDown(e, 4)}>
            <div className="c cardImage"></div>
            <div className="c cardDesc">
              <div className="c h3"><h3>{header4}</h3><p>{desc4}</p></div>
            </div>
          </div>
        </label>
      </div>
      <div className="item a5" style={a5Style}>
        <label>
          <input ref={radios.a5} type="radio" name="cards" />
          <div className="c card" onPointerDown={e => handleMouseDown(e, 5)}>
            <div className="c cardImage"></div>
            <div className="c cardDesc">
              <div className="c h3"><h3>{header5}</h3><p>{desc5}</p></div>
            </div>
          </div>
        </label>
      </div>
      <div className="item a6" style={a6Style}>
        <label>
          <input ref={radios.a6} type="radio" name="cards" />
          <div className="c card" onPointerDown={e => handleMouseDown(e, 6)}>
          <div className="c cardImage"></div>
            <div className="c cardDesc">
              <div className="c h3"><h3>{header6}</h3><p>{desc6}</p></div>
            </div>
          </div>
        </label>
      </div>
      <div className="item a7" style={a7Style}>
        <label>
          <input ref={radios.a7} type="radio" name="cards" />
          <div className="c card" onPointerDown={e => handleMouseDown(e, 7)}>
            <div className="c cardImage"></div>
            <div className="c cardDesc">
              <div className="c h3"><h3>{header7}</h3><p>{desc7}</p></div>
            </div>
          </div>
        </label>
      </div>
    </div>
  </section>
}