import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { useState } from 'react';

function Menu(){

  // Used for the cylinder effect in the hello section, pushes the menu button container to the bottom, while transforming rotate and scale along the way
  const [menuTop, setMenuTop] = useState<number>(0)
  const [menuScale, setMenuScale] = useState<number>(1)
  const [buttonRotate, setButtonRotate] = useState<number>(0)

  // Individually sets each button's position from the top, as the whole section gets pushed to the bottom, these numbers are between 0 and -screenHeight - (buttonHeight + top margin)
  const [helloTop, setHelloTop] = useState<number>(0)
  const [aboutTop, setAboutTop] = useState<number>(0)
  const [projectsTop, setProjectsTop] = useState<number>(0)
  const [contactTop, setContactTop] = useState<number>(0)

  // used for pushing them up against the left side of the screen - the whole calculation in helloLeft is multiplied by this
  // so that when this is 0, Left will be 0 (+10) and the button will be 10 pixels off the left screen edge
  // setting this to 1 just defaults the rest of the calculation to it's natural position in the row of buttons at top or bottom
  const [helloTangent, setHelloTangent] = useState<number>(1)
  const [aboutTangent, setAboutTangent] = useState<number>(1)
  const [projectsTangent, setProjectsTangent] = useState<number>(1)
  const [contactTangent, setContactTangent] = useState<number>(1)
  // re-align as each button moves in and out of rows - the helloLeft calculation subtracts this from the total, so at each realignment
  // I need to take the original starting point into consideration, and subtract as many button widths + border (5px) as required.
  // when they get to the top, they change order, so hello and about will need to go into negative numbers to push them further right than their original pos
  const [helloAlign, setHelloAlign] = useState<number>(0)
  const [aboutAlign, setAboutAlign] = useState<number>(0)
  const [projectsAlign, setProjectsAlign] = useState<number>(0)
  const [contactAlign, setContactAlign] = useState<number>(0)
  // currently not accounting for width of vertical scroll bar - I'm hoping to replace this later anyway
  // This is the calculation described in the above two statements, that sets the overall left position of the buttons
  const [buttonWidth, setButtonWidth] = useState<number>(window.innerWidth > 500 ? 100 : window.innerWidth / 5)
  const [helloLeft, setHelloLeft] = useState<number>((window.innerWidth / 2 - (buttonWidth * 2 + 17.5) - helloAlign) * helloTangent + 10)
  const [aboutLeft, setAboutLeft] = useState<number>((window.innerWidth / 2 - (buttonWidth + 12.5) - aboutAlign) * aboutTangent + 10)
  const [projectsLeft, setProjectsLeft] = useState<number>((window.innerWidth / 2 - 7.5 - projectsAlign) * projectsTangent + 10)
  const [contactLeft, setContactLeft] = useState<number>((window.innerWidth / 2 + (buttonWidth -2.5) - contactAlign) * contactTangent + 10)
  // width of button used in conjunction with buttonWidth and tangent
  const [helloWidth, setHelloWidth] = useState<number>((buttonWidth - 15) * helloTangent + 15)
  const [aboutWidth, setAboutWidth] = useState<number>((buttonWidth - 15) * aboutTangent + 15)
  const [projectsWidth, setProjectsWidth] = useState<number>((buttonWidth - 15) * projectsTangent + 15)
  const [contactWidth, setContactWidth] = useState<number>((buttonWidth - 15) * contactTangent + 15)

  window.addEventListener('resize', setAllLeft);
  
  function setAllLeft(){
    let buttonWidth = window.innerWidth > 500 ? 100 : window.innerWidth / 5 // local variable to avoid setstate delay
    setButtonWidth(buttonWidth)
    setHelloLeft((window.innerWidth / 2 - (buttonWidth * 2 + 17.5) - helloAlign) * helloTangent + 5)
    setAboutLeft((window.innerWidth / 2 - (buttonWidth + 12.5) - aboutAlign) * aboutTangent + 5)
    setProjectsLeft((window.innerWidth / 2 - 7.5 - projectsAlign) * projectsTangent + 5)
    setContactLeft((window.innerWidth / 2 + (buttonWidth -2.5) - contactAlign) * contactTangent + 5)
    setHelloWidth((buttonWidth - 15) * helloTangent + 15)
    setAboutWidth((buttonWidth - 15) * aboutTangent + 15)
    setProjectsWidth((buttonWidth - 15) * projectsTangent + 15)
    setContactWidth((buttonWidth - 15) * contactTangent + 15)
    }

  useScrollPosition(({ prevPos, currPos }) => {
    // window limit sets the first section scroll limit to the lesser of window height or 500px
    let windowLimit: number = Math.min(window.innerHeight, 500);
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
    }

    // HELLO -- HELLO -- HELLO -- HELLO -- HELLO -- HELLO
    // second set of conditions to set each button vertical pos individually
    // start and stop effecting each button when the relevant section is in view with a 50px buffer for height of button and margin
    // hello section, before 500px is 0, after 2*window height is -window height + 50px
    if (currPos.y > -windowLimit) {
      setHelloTop(0)
      setHelloAlign(0)
      setAboutAlign(0)
      setProjectsAlign(0)
      setContactAlign(0)
    }
    else if (currPos.y < -window.innerHeight * 2) setHelloTop(-window.innerHeight + 50)
    else {
      // This could be refined a little, but it's a combination of the above else if condition and below logic, and it also affects the tangent conditions below, for now it works well enough
      setHelloTop((-(currPos.y + windowLimit) / (window.innerHeight * 2 - windowLimit + 70) * -window.innerHeight))
    }
    // two more statements that kick in 50px before and after the above to push button to the left
    if (currPos.y < -windowLimit + 25 && currPos.y > -windowLimit - 25) {
      // smooth ease from mid to left (1 to 0 tangent as %)
      // also need to adjust setabout/contact/projectAlign to be three buttons
      let temp = 1 - (-windowLimit + 25 - currPos.y) / 50
      setHelloTangent(temp)
      // setHelloWidth((buttonWidth - 30) * temp + 30) // Not needed beause I'm calling setAllLeft every frame while scrolling
      let tempAlign = (buttonWidth / 2 + 10) * (1 - temp)
      setHelloAlign(0)
      setAboutAlign(tempAlign)
      setProjectsAlign(tempAlign)
      setContactAlign(tempAlign)
    }
    // Adjust the left alignment and width of the button as it reaches the top of the screen
    else if (currPos.y < -window.innerHeight * 2 + 50 && currPos.y > -window.innerHeight * 2) {
      let temp = (-window.innerHeight * 2 + 50 - currPos.y) / 50
      setHelloTangent(temp)
      // setHelloWidth((buttonWidth - 15) * temp + 15)
      // setHelloAlign(-buttonWidth * 1.5 - 10)
    }
    else if (currPos.y < -windowLimit - 25 && currPos.y > -window.innerHeight * 2 + 50) {
      setHelloTangent(0)
      // setHelloWidth(15)
      setHelloAlign(-buttonWidth * 1.5 - 10)
      let tempAlign = (buttonWidth / 2 + 10)
      setAboutAlign(tempAlign)
      setProjectsAlign(tempAlign)
      setContactAlign(tempAlign)

    }    
    else {
    setHelloTangent(1)
    // setHelloWidth(buttonWidth)
    // setAboutTangent(0)
    }

    // ABOUT -- ABOUT -- ABOUT -- ABOUT -- ABOUT
    // about section, from window height * 1 (-50) to window height * 4 (-50)
    if (currPos.y > -window.innerHeight - 50) {
      setAboutTop(0)
    }
    else if (currPos.y < -window.innerHeight * 4 - 50) {
      setAboutTop(-window.innerHeight + 50)
    }
    else {
      // currPos.y is a negative number, and button pos needs to start at 0 and go negative
      // so this is clamped between a calculation of the scrollpos for the current section, and screenHeight - 50px
      setAboutTop(Math.max((window.innerHeight + currPos.y + 50) / 3, -window.innerHeight + 50 ))
      setProjectsAlign(buttonWidth + 15)
      setContactAlign(buttonWidth + 15)
    }
    // left alignment
    if (currPos.y > -window.innerHeight){
      setAboutTangent(1)
    }
    else if (currPos.y < -window.innerHeight && currPos.y >= -window.innerHeight - 100) {
      let temp = 1 - (-window.innerHeight - currPos.y) / 100
      setAboutTangent(temp)
      let tempAlign = (buttonWidth / 2 + 10) + (buttonWidth / 2.5 + 12.5) * (1 - temp)
      setProjectsAlign(tempAlign)
      setContactAlign(tempAlign)
    }
    else if (currPos.y < -window.innerHeight - 100 && currPos.y >= -window.innerHeight * 4 + 100) {
      setAboutTangent(0)
    }
    else if (currPos.y < -window.innerHeight * 4 + 100 && currPos.y >= -window.innerHeight * 4) {
      let temp = ((-window.innerHeight * 4 + 100 - currPos.y) / 100)
      setAboutTangent(temp)
      setHelloAlign((-buttonWidth * 1.5 - 5) - (buttonWidth / 2 + 2.5) * temp)
    }
    else {
      setAboutTangent(1)
      setHelloAlign(-buttonWidth * 2 - 12.5)
      setAboutAlign(5)
    }

    // PROJECTS -- PROJECTS -- PROJECTS -- PROJECTS -- PROJECTS
    // projects section, from window Height * 3 to window height * 6
    if (currPos.y > -window.innerHeight * 3 - 50) {
      setProjectsTop(0)
    }
    else if (currPos.y < -window.innerHeight * 6 - 50) {
      setProjectsTop(-window.innerHeight + 50)
    }
    else {
      setProjectsTop(Math.max((currPos.y + 50) / 3 + window.innerHeight, -window.innerHeight + 50 ))
      setContactAlign(buttonWidth * 1.5 + 17.5)
    }
    // left alignment
    if (currPos.y > -window.innerHeight * 3) {
      setProjectsTangent(1)
    }
    else if (currPos.y < -window.innerHeight * 3 && currPos.y >= -window.innerHeight * 3 - 100) {
      let temp = 1 - (-window.innerHeight * 3 - currPos.y) / 100
      setProjectsTangent(temp)
      let tempAlign = (buttonWidth + 15) + (buttonWidth / 2) * (1 - temp)
      setContactAlign(tempAlign)
    }
    else if (currPos.y < -window.innerHeight * 3 - 100 && currPos.y >= -window.innerHeight * 6 + 100) { 
      setProjectsTangent(0)
    }
    else if (currPos.y < -window.innerHeight * 6 + 100 && currPos.y >= -window.innerHeight * 6) {
      let temp = ((-window.innerHeight * 6 + 100 - currPos.y) / 100)
      setProjectsTangent(temp)
      setHelloAlign((-buttonWidth * 2 - 17.5) - (buttonWidth / 2 + 2.5) * temp)
      setAboutAlign((-buttonWidth / 2) * temp)
      setProjectsAlign(buttonWidth * 1.5 + 17.5)
    }
    else {
      setProjectsTangent(1)
      setHelloAlign(-buttonWidth * 2.5 - 17.5)
      setAboutAlign(-buttonWidth / 2)
      setProjectsAlign(buttonWidth * 1.5 + 17.5)
    }

    // CONTACT -- CONTACT -- CONTACT -- CONTACT -- CONTACT -- CONTACT
    // contact section; from window height * 5 onwards, exaggerated movement as you can't scroll past the bottom section
    if (currPos.y > -window.innerHeight * 5 - 50) setContactTop(0)
    else if (currPos.y < -window.innerHeight * 7 + 200) setContactTop(-window.innerHeight + 50)
    else if (currPos.y < -window.innerHeight * 5 && currPos.y >= -window.innerHeight * 7 + 200) {
      setContactTop(Math.max(((currPos.y + 50) / 5 + window.innerHeight) * 3, -window.innerHeight + 50))
    }
    // left alignment
    if (currPos.y > -window.innerHeight * 5) {
      setContactTangent(1)
    }
    else if (currPos.y < -window.innerHeight * 5 && currPos.y >= -window.innerHeight * 5 - 100) {
      setContactTangent(1 - (-window.innerHeight * 5 - currPos.y) / 100)
    }
    else if (currPos.y < -window.innerHeight * 5 - 100 && currPos.y >= -window.innerHeight * 7 + 200) {
      setContactTangent(0)
    }
    else if (currPos.y < -window.innerHeight * 7 + 200 && currPos.y >= -window.innerHeight * 7 + 100) {
      let temp = ((-window.innerHeight * 7 + 200 - currPos.y) / 100)
      setContactTangent(temp)
      setHelloAlign((-buttonWidth * 2.5 - 20) - (buttonWidth / 2 + 2.5) * temp)
      setAboutAlign((-buttonWidth / 2 - 2.5) - (buttonWidth / 2 + 2.5) * temp)
      setProjectsAlign((buttonWidth * 1.5 + 15) - (buttonWidth / 2 + 2.5) * temp)
      setContactAlign(buttonWidth * 3 + 30)
    }
    else {
      setContactTangent(1)
      setHelloAlign((-buttonWidth * 3 - 22.5))
      setAboutAlign((-buttonWidth - 5))
      setProjectsAlign((buttonWidth + 12.5))
      setContactAlign(buttonWidth * 3 + 30)
    }

    // yep, this will be constantly setting state and aligning all buttons whenever you're scrolling...
    setAllLeft();
  })

  const helloStyle = { perspectiveOrigin: "200% center", perspective: `${menuScale * 100 + 300}px`, top: `${helloTop}px`, left: `${helloLeft}px`, width: `${helloWidth}px` };
  const aboutStyle = { perspectiveOrigin: "100% center", perspective: `${menuScale * 100 + 300}px`, top: `${aboutTop}px`, left: `${aboutLeft}px`, width: `${aboutWidth}px` };
  const projectsStyle = { perspectiveOrigin: "0% center", perspective: `${menuScale * 100 + 300}px`, top: `${projectsTop}px`, left: `${projectsLeft}px`, width: `${projectsWidth}px` };
  const contactStyle = { perspectiveOrigin: "-100% center", perspective: `${menuScale * 100 + 300}px`, top: `${contactTop}px`, left: `${contactLeft}px`, width: `${contactWidth}px` };
  const front = { transform: `rotateX(${buttonRotate * 180}deg) translateZ(15px)`, filter: `brightness(${2 * buttonRotate + 1})` };
  const bottom = { transform: `rotateX(${buttonRotate * 180 - 90}deg) translateZ(15px)`, filter: `brightness(${2 * buttonRotate})` };
  const back = { transform: `rotateX(${buttonRotate * 180 - 180}deg) translateZ(15px)`, filter: `brightness(${2 * buttonRotate - 1})` };



  
  return <div style={{ 
      top:`${menuTop}px`,
      transform: `scale(${menuScale})`
      }} id="menu">
    <a href="#hello" style={helloStyle} className="menuButton helloButton">
      <div style={front} className='menuButtonPanel'>Hello</div>
      <div style={bottom} className='menuButtonPanel'>Hello</div>
      <div style={back} className='menuButtonPanel'>Hello</div>
    </a>
    <a href="#about" style={aboutStyle} className="menuButton aboutButton">
      <div style={front} className='menuButtonPanel'>About</div>
      <div style={bottom} className='menuButtonPanel'>About</div>
      <div style={back} className='menuButtonPanel'>About</div>
    </a>
    <a href="#projects" style={projectsStyle} className="menuButton projectsButton">
      <div style={front} className='menuButtonPanel'>Projects</div>
      <div style={bottom} className='menuButtonPanel'>Projects</div>
      <div style={back} className='menuButtonPanel'>Projects</div>
    </a>
    <a href="#contact" style={contactStyle} className="menuButton contactButton">
      <div style={front} className='menuButtonPanel'>Contact</div>
      <div style={bottom} className='menuButtonPanel'>Contact</div>
      <div style={back} className='menuButtonPanel'>Contact</div>
    </a>
  </div>
}

export default Menu;