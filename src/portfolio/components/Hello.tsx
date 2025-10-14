import { useBodyScrollPosition } from "@n8tb1t/use-scroll-position"
import { useState, useEffect, useRef } from "react"
import sunbeam from "../images/sunbeam.jpg"
import penguin from "../images/penguin.jpg"
import trees   from "../images/trees.jpg"


function Hello(){

  const [opacity1, setop1] = useState<number>(1)
  const [opacity2, setop2] = useState<number>(1)
  const [rotate, setRotate] = useState<number>(0)

  const leftPanel = useRef<HTMLDivElement | null>(null)
  const [leftPanelLeft, setLPL] = useState<number>(0)
  const [bothPanelTop, setBPT] = useState<number>(0)
  const [rightPanelLeft, setRPL] = useState<number>(0)

  const bgNone = useRef<string>("")


  useEffect(() => updateScreen, [])
  useEffect(() => {
    window.addEventListener('resize', updateScreen);
    return () => {
      window.removeEventListener('resize', updateScreen);
    };
  }, []);

  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      updateScreen();
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  function updateScreen(){  // Currently only resizes correctly when scrolled all the way to the top
    const LPcoords = leftPanel.current?.getBoundingClientRect()
      if (LPcoords) {
        // setLPL(-LPcoords.left)
        setLPL(document.body.clientWidth * -0.1)
        // setBPT(-LPcoords.top)
        setBPT(window.innerHeight * -0.5 + (document.body.clientWidth * 0.06))
        // setRPL(-LPcoords.left - LPcoords.width)
        setRPL(document.body.clientWidth * -0.1 - (document.body.clientWidth * 0.2))
      }
    // setLPL(-window.innerWidth * 0.1)
  }

  
  useBodyScrollPosition(({ prevPos, currPos }) => {
    // rotation
    if (currPos.y === 0) setRotate(0)
    else if (currPos.y >= -150) setRotate(currPos.y * 1.65 / -500) // turning
    else if (currPos.y < -150 && currPos.y > -350) setRotate(0.5) // stopped
    else if (currPos.y <= -350 && currPos.y >= -500) setRotate((500 + currPos.y) * 1.65 / -500 + 1) // turning
    else if (currPos.y < -500 && currPos.y > -800) setRotate(1) // stopped
    if (currPos.y < -500) bgNone.current = "bgNone"
    else if (bgNone.current == "bgNone") bgNone.current = ""
    // bg opacity
    if (currPos.y >= -80){
      setop1(1)
      setop2(1)
    }
    else if (currPos.y < -80 && currPos.y >= -190) {
      setop1(1 - ((-currPos.y - 80) / 110))
      setop2(1)
    }
    else if (currPos.y < -190 && currPos.y >= -310) {
      setop1(0)
      setop2(1)
    }
    else if (currPos.y < -310 && currPos.y >= -420){
      setop2(1 - ((-currPos.y - 310) / 110))
      setop1(0)
    }
    else {
      setop1(0)
      setop2(0)
    }
  })

  // The 0.0001 below is to fight a weird bug.  When two divs with perspective perfectly align rotation it adds a sort of overlap
  const frontRight = { transform: `rotateX(${-rotate * 180 + 0.0001}deg) translateZ(6vw)`, filter: `brightness(${2 * -rotate + 1})`, backgroundPosition: `${rightPanelLeft}px ${bothPanelTop}px` };
  const bottomRight = { transform: `rotateX(${-rotate * 180 + 90.0001}deg) translateZ(6vw)`, filter: `brightness(${2 * -rotate + 2})`, backgroundPosition: `${rightPanelLeft}px ${bothPanelTop}px` };
  const backRight = { transform: `rotateX(${-rotate * 180 - 179.9999}deg) translateZ(6vw)`, filter: `brightness(${2 * -rotate + 3})`, backgroundPosition: `${rightPanelLeft}px ${bothPanelTop}px` };
  const front = { transform: `rotateX(${rotate * 180}deg) translateZ(6vw)`, filter: `brightness(${2 * rotate + 1})`, backgroundPosition: `${leftPanelLeft}px ${bothPanelTop}px`};
  const bottom = { transform: `rotateX(${rotate * 180 - 90}deg) translateZ(6vw)`, filter: `brightness(${2 * rotate})`, backgroundPosition: `${leftPanelLeft}px ${bothPanelTop}px` };
  const back = { transform: `rotateX(${rotate * 180 - 180}deg) translateZ(6vw)`, filter: `brightness(${2 * rotate - 1})`, backgroundPosition: `${leftPanelLeft}px ${bothPanelTop}px` };
  const right = { transform: `rotateY(90deg) rotateZ(${rotate * 180}deg)`, opacity: rotate * 180 % 90 ? 1 : 0 }

  return <section id="Hello" style={{ backgroundImage: `url(${trees})` }}>
    <div className="hellobg" style={{ backgroundImage: `url(${penguin})`, opacity: opacity2 }}></div>
    <div className="hellobg" style={{ backgroundImage: `url(${sunbeam})`, opacity: opacity1 }} onLoad={updateScreen}></div>
    <div className="spinContainer">
      <div className="helloSpinLeft">
        <div style={front} className='helloSpinPanel panel1' ref={leftPanel}> </div>
        <div style={bottom} className='helloSpinPanel panel2 middleBorder'>I am&#8202;</div>
        <div style={back} className={'helloSpinPanel panel3 ' + (bgNone.current)}>I'm a&#8202;</div>
        <div style={right} className='helloSpinPanelRight'> </div>
      </div>
      <div className="helloSpin">
        <div style={frontRight} className='helloSpinPanel panel1'>&#8202;Hello</div>
        <div style={bottomRight} className='helloSpinPanel panel2 middleBorder'>&#8202;James</div>
        <div style={backRight} className={'helloSpinPanel panel3 ' + (bgNone.current)}>&#8202;Software Engineer</div>
      </div>
    </div>
  </section>
}

export default Hello