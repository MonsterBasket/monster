import { ReactElement, useEffect, useRef, useState } from "react";
import "./CSS/projects.css"
import monster from "../images/screengrab.png"
import battleship from "../images/battleship.png"
import Typing from "./Typing.tsx";

type Props = {turnToCheat: number;}

export default function Projects({turnToCheat}: Props){
  const [vertical, setVertical] = useState<boolean>(window.innerHeight > window.innerWidth)
  const [panel1, setPanel1] = useState<string>(vertical ? "projTop" : "projLeft")
  const [panel2, setPanel2] = useState<string>(vertical ? "projBottom" : "projRight")
  const noScroll = useRef<string>(vertical ? "" : "noScroll")
  const [, rerender] = useState<string[]>([])
  const position = useRef<number[]>([1,2,3])
  const active = useRef<number>(2)
  const xTouch = useRef<number>(0);
  const yTouch = useRef<number>(0);

  useEffect(() => {
    window.addEventListener('resize', updateScreen);
    return () => {
      window.removeEventListener('resize', updateScreen);
    };
  }, []);

  useEffect(() => {
    if (turnToCheat == 1){
      active.current = position.current[1]
      window.addEventListener('touchstart', handleTouchStart, false);
      window.addEventListener('touchmove', handleTouchMove, false);
    }
    else {
      active.current = 0;
      window.removeEventListener('touchstart', handleTouchStart, false);        
      window.removeEventListener('touchmove', handleTouchMove, false);
    }
    return () => {
      window.removeEventListener('touchstart', handleTouchStart, false);        
      window.removeEventListener('touchmove', handleTouchMove, false);
    };  
  }, [turnToCheat])

  useEffect(() => {active.current = position.current[1]}, [position.current])


  function handleTouchStart(e:any) {
    if (!e.target.classList.contains("tp") && !e.target.parentElement.classList.contains("tp")) return;
    xTouch.current = e.touches[0].clientX;                                      
    yTouch.current = e.touches[0].clientY;                                      
  }
                                                                          
  function handleTouchMove(e:any) {
    if (!e.target.classList.contains("tp") && !e.target.parentElement.classList.contains("tp")) return;
    if ( !xTouch.current || !yTouch.current ) return;

    const xUp = e.touches[0].clientX;                                    
    const yUp = e.touches[0].clientY;

    const xDiff = xTouch.current - xUp;
    const yDiff = yTouch.current - yUp;
                                                                        
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
      if (!vertical) return
      const topHalf = yUp < (window.innerHeight / 2)
      if ( xDiff > 0 ) {
        /* right swipe */ 
        topHalf && change(position.current[0] -1)
        !topHalf && change(position.current[2] -1)
      } else {
        /* left swipe */
        topHalf && change(position.current[2] -1)
        !topHalf && change(position.current[0] -1)
      }                       
    } else {
      if (vertical) return
      const leftHalf = xUp < (window.innerWidth / 2)
      if ( yDiff > 0 ) {
        /* up swipe */ 
        leftHalf && change(position.current[0] -1)
        !leftHalf && change(position.current[2] -1)
      } else { 
        /* down swipe */
        leftHalf && change(position.current[2] -1)
        !leftHalf && change(position.current[0] -1)
      }                                                                 
    }
    /* reset values */
    xTouch.current = 0;
    yTouch.current = 0;
    return false;
  }

  function updateScreen(){
    setVertical(window.innerHeight > window.innerWidth)
    setPanel1(window.innerHeight > window.innerWidth ? "projTop" : "projLeft");
    setPanel2(window.innerHeight > window.innerWidth ? "projBottom" : "projRight");
    noScroll.current = (window.innerHeight > window.innerWidth) ? "" : "noScroll";
  }

  function change(num:number){
    let temp:number[] = []
    if (num == 0) temp = [3,1,2]
    else if (num == 1) temp = [1,2,3]
    else if (num == 2) temp = [2,3,1]
    position.current = temp
    rerender([])
  }

  const project1:ReactElement = <img className={`project tp project${position.current[0]} ${noScroll.current}`} src={monster}></img>
  const project2:ReactElement = <div className={`project tp project${position.current[1]} ${noScroll.current}`}><Typing active={position.current[1] == 2 ? true : false}/></div>
  // const project2:ReactElement = <img className={`project tp project${position.current[1]} ${noScroll.current}`} src={monster}></img>
  const project3:ReactElement = <img className={`project tp project${position.current[2]} ${noScroll.current}`} src={battleship}></img>

  const project1Link:ReactElement = <h2 className="tp">React RPG</h2>
  const project2Link:ReactElement = <h2 className="tp"><a href="https://monsterbasket.github.io/TypingGame/" target="_blank">Typing Game</a></h2>
  const project3Link:ReactElement = <h2 className="tp"><a href="https://github.com/MonsterBasket/battleship" target="_blank">Battleship</a></h2>

  const project1Desc:ReactElement = <span className="tp">This was my "pièce de résistance" of my bootcamp.  A lot to be proud of despite being a bit janky and buggy.  On top of that the server is constantly out of RAM so it's pretty broken right now.  I've taken it off-line for now and I'll take a look when this folio site is finished.</span>
  const project2Desc:ReactElement = <span className="tp">A JavaScript typing game. Choose a theme and type the words that appear on the screen before they reach the end. Words and background image come from separate APIs and are generated based on the theme you choose.</span>
  const project3Desc:ReactElement = <span className="tp">Battleship made in Ruby, you can't play it because it's almost impossible to host a pure Ruby app, but feel free to look at the code in the link provided.</span>

  return <section id="Projects">
        <div className={panel1}>
          {project1}
          {project2}
          {project3}
        </div>
        <div className={panel2}>
          <div className={`projDesc tp desc${position.current[0]} ${noScroll.current}`}>
            <div>
              {project1Link}
              {project1Desc}
            </div>
          </div>
          <div className={`projDesc tp desc${position.current[1]} ${noScroll.current}`}>
            <div>
              {project2Link}
              {project2Desc}
            </div>
          </div>
          <div className={`projDesc tp desc${position.current[2]} ${noScroll.current}`}>
            <div>
              {project3Link}
              {project3Desc}
            </div>
          </div>          
        </div>
        <div className={`${panel1}Cover`}></div>
        <div className={`${panel1}Rule`}>
          <div className="projButtonBack">
            <div className={`projButton active${position.current[1]}`} onClick={() => change(0)}></div>
            <div className={`projButton active${position.current[0]}`} onClick={() => change(1)}></div>
            <div className={`projButton active${position.current[2]}`} onClick={() => change(2)}></div>
          </div>
          <div className="projUpButton" onClick={() => change(position.current[0] -1)}></div>
          <div className="projDownButton" onClick={() => change(position.current[2] -1)}></div>
        </div>
  </section>
}