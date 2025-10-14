import { useBodyScrollPosition } from '@n8tb1t/use-scroll-position'
import React, { useEffect, useState } from 'react';

type Props = {
  buttonWidth: number;
  setButtonWidth: (val: number) => void;
  buttonOpacity: number;
  setButtonOpacity: (val: number) => void;
  setTurnToCheat: (val: number) => void;
};
export default function Menu({buttonWidth, setButtonWidth, buttonOpacity, setButtonOpacity, setTurnToCheat}:Props){

  // Used for the cylinder effect in the hello section, pushes the menu button container to the bottom, while transforming rotate and scale along the way
  const [menuTop, setMenuTop] = useState<number>(0)
  const [menuScale, setMenuScale] = useState<number>(1)
  const [buttonRotate, setButtonRotate] = useState<number>(0)
  const [contZ, setContZ] = useState<number>(0)

  // currently not accounting for width of vertical scroll bar - I'm hoping to replace this later anyway
  // This is the calculation described in the above two statements, that sets the overall left position of the buttons
  const [helloLeft, setHelloLeft] = useState<number>((window.innerWidth / 2 - (buttonWidth * 2 + 17.5)) + 10)
  const [aboutLeft, setAboutLeft] = useState<number>((window.innerWidth / 2 - (buttonWidth + 12.5)) + 10)
  const [projectsLeft, setProjectsLeft] = useState<number>((window.innerWidth / 2 - 7.5) + 10)
  const [contactLeft, setContactLeft] = useState<number>((window.innerWidth / 2 + (buttonWidth -2.5)) + 10)
  const [scrollPos, setScrollPos] = useState<number>(0)

  useEffect(() => {
    window.addEventListener('resize', setAllLeft);
    return () => {
      window.removeEventListener('resize', setAllLeft);
    };
  }, []);
  
  function setAllLeft(){
    let buttonWidth:number = window.innerWidth > 500 ? 100 : window.innerWidth / 5 // local variable to avoid setstate delay
    setButtonWidth(buttonWidth)
    setHelloLeft((window.innerWidth / 2 - (buttonWidth * 2 + 17.5)) + 10)
    setAboutLeft((window.innerWidth / 2 - (buttonWidth + 12.5)) + 10)
    setProjectsLeft((window.innerWidth / 2 - 7.5) + 10)
    setContactLeft((window.innerWidth / 2 + (buttonWidth -2.5)) + 10)
    }

  function turnToCheat(page:number){
    if (scrollPos < 1.5 * -window.innerHeight) setTurnToCheat(page)
    else setTurnToCheat(page+10)
  }

  useBodyScrollPosition(({ prevPos, currPos }) => {
    // window limit sets the first section scroll limit to the lesser of window height or 500px
    let windowLimit: number = Math.min(window.innerHeight, 500);
    setScrollPos(currPos.y);
    if (currPos.y === 0) { // top of screen / not scrolled
      setMenuTop(0);
      setMenuScale(1);
      setButtonRotate(0);
    }
    else if (currPos.y > -windowLimit) { // first 500 pixels of scroll
      // a** + b** = c**,  ==>  b** = c** - a**  ==>  b = sqrt(c** - a**)
      // a = % of scroll from 0 - 500px
      // b = actual position from top
      // c = radius of circle - we can just use 1 as it's a % conversion
      // Final equation: radius - scrollPos * windowHeight
      setMenuTop(1 - (currPos.y / -windowLimit) * (-window.innerHeight + 50))
      setButtonRotate(currPos.y / -windowLimit)
      setContZ(0);
      setAllLeft();
      if (currPos.y / -windowLimit < 0.5) {
        // b = scale of buttons
        // scale:         sqrt(radius -               scrollPos**)          + scaleAdjustment / (1 + scaleAdjustment)
        setMenuScale((1 - Math.sqrt(1 - Math.pow(1 - (currPos.y / -windowLimit), 2)) + 0.5) / 1.5)
      }
      else {
        setMenuScale((1 - Math.sqrt(1 - Math.pow(     currPos.y / -windowLimit,  2)) + 0.5) / 1.5)
      }
    }
    else { // set menu buttons to bottom by default
      setMenuTop(window.innerHeight - 50);
      setMenuScale(1);
      setButtonRotate(1);
      setContZ(2);
    }

    if (currPos.y < -window.innerHeight){
      let farLeft: number = buttonWidth * 2 + 30;
      let middle: number = window.innerWidth / 2;
      let leftAdjust: number = (currPos.y + window.innerHeight * 1.5) / -window.innerHeight;
      leftAdjust = -2 * leftAdjust * (middle - farLeft) + farLeft;
      if (currPos.y > 1.5 * -window.innerHeight){
        //slide to the left
        setHelloLeft((leftAdjust - (buttonWidth * 2 + 17.5)) + 5)
        setAboutLeft((leftAdjust - (buttonWidth + 12.5)) + 5)
        setProjectsLeft((leftAdjust - 7.5) + 5)
        setContactLeft((leftAdjust + (buttonWidth -2.5)) + 5)
        setButtonOpacity(1)
      }
      else{
        setHelloLeft((farLeft - (buttonWidth * 2 + 17.5)) + 5)
        setAboutLeft((farLeft - (buttonWidth + 12.5)) + 5)
        setProjectsLeft((farLeft - 7.5) + 5)
        setContactLeft((farLeft + (buttonWidth -2.5)) + 5)
        const limit:number = 1.5 * window.innerHeight + window.innerHeight / 5;
        setButtonOpacity((currPos.y + limit) / (window.innerHeight / 5))
      }
      //move to the top
      // setMenuTop(Math.max(currPos.y + 2 * window.innerHeight - 50, 0))
    }
  })

  const helloStyle = { perspectiveOrigin: "200% center", perspective: `${menuScale * 100 + 300}px`, left: `${helloLeft}px`, width: `${buttonWidth}px` };
  const aboutStyle = { perspectiveOrigin: "100% center", perspective: `${menuScale * 100 + 300}px`, left: `${aboutLeft}px`, width: `${buttonWidth}px` };
  const projectsStyle = { perspectiveOrigin: "0% center", perspective: `${menuScale * 100 + 300}px`, left: `${projectsLeft}px`, width: `${buttonWidth}px` };
  const contactStyle = { perspectiveOrigin: "-100% center", perspective: `${menuScale * 100 + 300}px`, left: `${contactLeft}px`, width: `${buttonWidth}px` };
  const front = { transform: `rotateX(${buttonRotate * 180}deg) translateZ(15px)`, filter: `brightness(${2 * buttonRotate + 1})` };
  const bottom = { transform: `rotateX(${buttonRotate * 180 - 90}deg) translateZ(15px)`, filter: `brightness(${2 * buttonRotate})` };
  const back = { transform: `rotateX(${buttonRotate * 180 - 180}deg) translateZ(15px)`, filter: `brightness(${2 * buttonRotate - 1})` };

  // The buttons were originally "Hello, About, Projects, Contact", they're now "About, Projects, Animation, Contact"
  // Too many variables and css classes to rename for something that may change again in the future.

  const mainMenuStyle:React.CSSProperties = {
    top:`${menuTop}px`,
    transform: `scale(${menuScale})`,
    opacity: buttonOpacity < 1 ? 0 : 1, // a clean cut works better than a transition, but I'm still using this var for the tab transformation
    pointerEvents: buttonOpacity < 1 ? "none" : "auto",
    zIndex: contZ
  }
  
  return <div className="menuCont">
    <div style={mainMenuStyle} id="menu">
          <div style={{display:'none'}}>If you're poking around here in the HTML you'll see the button names are wrong.  I changed them around and can't be assed changing all the variable names that control the positions.</div>
      <a href="#About" onClick={() => turnToCheat(0)} style={helloStyle} className="menuButton helloButton">
        <div style={front} className='menuButtonPanel'>About</div>
        <div style={bottom} className='menuButtonPanel'>About</div>
        <div style={back} className='menuButtonPanel'>About</div>
      </a>
      <a href="#Projects" onClick={() => turnToCheat(1)} style={aboutStyle} className="menuButton aboutButton">
        <div style={front} className='menuButtonPanel'>Projects</div>
        <div style={bottom} className='menuButtonPanel'>Projects</div>
        <div style={back} className='menuButtonPanel'>Projects</div>
      </a>
      <a href="#Animation" onClick={() => turnToCheat(2)} style={projectsStyle} className="menuButton projectsButton">
        <div style={front} className='menuButtonPanel'>Work</div>
        <div style={bottom} className='menuButtonPanel'>Work</div>
        <div style={back} className='menuButtonPanel'>Work</div>
      </a>
      <a href="#Contact" onClick={() => turnToCheat(3)} style={contactStyle} className="menuButton contactButton">
        <div style={front} className='menuButtonPanel'>Contact</div>
        <div style={bottom} className='menuButtonPanel'>Contact</div>
        <div style={back} className='menuButtonPanel'>Contact</div>
      </a>
    </div>
  </div>
  }