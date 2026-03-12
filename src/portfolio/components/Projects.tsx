import { ReactElement, useEffect, useRef, useState } from "react";
import "./CSS/projects.css"
import monster from "../images/screengrab.png"
import battleship from "../images/battleship.png"
import mask from "../images/MASK.png"
import Typing from "./Typing.tsx";

type Props = {turnToCheat: number;}

export default function Projects({turnToCheat}: Props){
  const [vertical, setVertical] = useState<boolean>(window.innerHeight > window.innerWidth)
  const [panel1, setPanel1] = useState<string>(vertical ? "projTop" : "projLeft")
  const [panel2, setPanel2] = useState<string>(vertical ? "projBottom" : "projRight")
  const noScroll = useRef<string>(vertical ? "" : "noScroll")
  const [, rerender] = useState<string[]>([])
  // 2 is visible, 1 and 3 are either side of it, 0 is hidden
  const position = useRef<number[]>([1,2,3,0])
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
        topHalf && change(-1)
        !topHalf && change(-2)
      } else {
        /* left swipe */
        topHalf && change(-2)
        !topHalf && change(-1)
      }                       
    } else {
      if (vertical) return
      const leftHalf = xUp < (window.innerWidth / 2)
      if ( yDiff > 0 ) {
        /* up swipe */ 
        leftHalf && change(-1)
        !leftHalf && change(-2)
      } else { 
        /* down swipe */
        leftHalf && change(-2)
        !leftHalf && change(-1)
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

  function change(num:number, max:number = 3){
    max -= 1
    let temp:number[] = position.current
    function up(){temp.unshift(temp.pop()!)}
    function dn(){temp.push(temp.shift()!)}
    if (num === -1) {up(); num = temp[1]} // the "!" asserts that temp array is not empty so that temp.pop() is NOT undefined
    else if (num === -2) {dn(); num = temp[1]}
    else if (num - temp[1] > 0) dn()
    else if (num - temp[1] < 0) up()
    // else if (num === temp[0]) up()
    // else if (num === temp[2] || num === temp[3]) dn()
    position.current = temp
    rerender([])
    if (num !== position.current[1] && max > 0) setTimeout(() => change(num, max), 250)
  }
  const alt1:string = "90s style top down video game."
  const alt3:string = "Text based battleship game."
  const alt4:string = "A human, an alien, and a dwarf standing around a table on a spaceship."

  const project1:ReactElement = <img className={`project tp project${position.current[0]} ${noScroll.current}`} alt={alt1} src={monster}></img>
  const project2:ReactElement = <div className={`project tp project${position.current[1]} ${noScroll.current}`}><Typing active={position.current[1] == 2 ? true : false}/></div>
  // const project2:ReactElement = <img className={`project tp project${position.current[1]} ${noScroll.current}`} src={monster}></img>
  const project3:ReactElement = <img className={`project tp project${position.current[2]} ${noScroll.current}`} alt={alt3} src={battleship}></img>
  const project4:ReactElement = <img className={`project tp project${position.current[3]} ${noScroll.current}`} alt={alt4} src={mask}></img>

  const project1Link:ReactElement = <h2 className="tp"><span style={{cursor: "not-allowed"}}>React RPG</span></h2>
  const project2Link:ReactElement = <h2 className="tp"><a href="https://monsterbasket.github.io/TypingGame/" target="_blank">Typing Game</a></h2>
  const project3Link:ReactElement = <h2 className="tp"><a href="https://github.com/MonsterBasket/battleship" target="_blank">Battleship</a></h2>
  const project4Link:ReactElement = <h2 className="tp"><a href="https://bslinger.itch.io/tim-tam" target="_blank">M.A.S.K</a></h2>

  const project1Desc:ReactElement = <span className="tp">This was my "pièce de résistance" of my bootcamp.  A lot to be proud of despite being a bit janky and buggy, but writing everything myself from scratch was a blast.  This includes enemy logic, collision detection, character movement, item drops, and a map maker tool for building levels.<br/><br/>It's off-line for now because some policy changes broke my server, but I'll get it up and running again soon.</span>
  const project2Desc:ReactElement = <span className="tp">A JavaScript typing game. Choose a theme and type the words that appear on the screen before they reach the end. Words and background image come from separate APIs and are generated based on the theme you choose.<br/><br/>Try typing the moving words right here in the browser, or click the title for the full game.</span>
  const project3Desc:ReactElement = <span className="tp">Battleship made in Ruby, you can't play it because it's almost impossible to host a pure Ruby app, but feel free to look at the code in the link provided.</span>
  const project4Desc:ReactElement = <span className="tp">My Afternoon Snack (Kleptomaniac) - This was my first ever Game Jam project, for the recent Global Game Jam with a theme of "mask"!  Despite not having done any 3D work for quite a while, I joined a team as a 3D modeller.  I had to learn Blender on the fly, but managed to create the environments and hair/hats for characters.</span>

  return <section id="Projects">
        <div className={panel1}>
          {project1}
          {project2}
          {project3}
          {project4}
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
          <div className={`projDesc tp desc${position.current[3]} ${noScroll.current}`}>
            <div>
              {project4Link}
              {project4Desc}
            </div>
          </div>          
        </div>
        <div className={`${panel1}Cover`}></div>
        <div className={`${panel1}Rule`}>
          <div className="projButtonBack">
            <div className={`projButton active${position.current[2]}`} onClick={() => change(0)}></div>
            <div className={`projButton active${position.current[1]}`} onClick={() => change(1)}></div>
            <div className={`projButton active${position.current[0]}`} onClick={() => change(2)}></div>
            <div className={`projButton active${position.current[3]}`} onClick={() => change(3)}></div>
          </div>
          <div className="projUpButton" onClick={() => change(-1)}><div/></div>
          <div className="projDownButton" onClick={() => change(-2)}><div/></div>
        </div>
  </section>
}