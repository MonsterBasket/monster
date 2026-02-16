import React, { useState, useEffect, useRef } from "react"
import sunbeam from "../images/sunbeam.jpg"
import penguin from "../images/penguin.jpg"
import trees   from "../images/trees.jpg"
import james   from "../images/me.png"
import './CSS/App.css';
import './CSS/hello.css';


function Hello({scrollPos: appScrollPos}:{scrollPos:number}){
  const leftPanel = useRef<HTMLDivElement | null>(null)
  const [leftPanelLeft, setLPL] = useState<number>(0)
  const [bothPanelTop, setBPT] = useState<number>(0)
  const [rightPanelLeft, setRPL] = useState<number>(0)
  const [scrollPos, setScroll] = useState<number>(0)

  useEffect(() => updateScreen, [])
  useEffect(() => {
    window.addEventListener('resize', updateScreen);
    return () => {
      window.removeEventListener('resize', updateScreen);
    };
  }, []);

  useEffect(() => {
    let tempPos = appScrollPos * 1.5
    if (tempPos <= 0.4) tempPos /= 0.8;
    else if (tempPos >= 0.6) tempPos = tempPos - 0.1 + (tempPos - 0.6) / 0.8;
    else tempPos = 0.5;
    setScroll(Math.min(tempPos, 1))
  }, [appScrollPos])

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

  function updateScreen(){
    const LPcoords = leftPanel.current?.getBoundingClientRect()
      if (LPcoords) {
        setLPL(window.innerWidth * -0.1)
        setBPT(window.innerHeight * -0.5 + (window.innerWidth * 0.06))
        setRPL(window.innerWidth * -0.1 - (window.innerWidth * 0.2))
      }
  }
  //right calc(100vw - 300px) top calc(100vh + 287px)
  const portLeftCalc = `right calc(-70vw + 15px) top calc(100vh + ${bothPanelTop}px)`
  const portRightCalc = `right calc(-10vw + 15px) top calc(100vh + ${bothPanelTop}px)`
  const frontRight = { backgroundPosition: `${portRightCalc}, ${rightPanelLeft}px ${bothPanelTop}px`, backgroundImage: scrollPos === 0 ? 'none' : `url(${james}), url(${sunbeam})` };
  const bottomRight = { backgroundPosition: `${rightPanelLeft}px ${bothPanelTop}px` };
  const backRight = { backgroundPosition: `${rightPanelLeft}px ${bothPanelTop}px`, backgroundImage: scrollPos === 1 ? 'none' : `url(${trees})` };
  const front = { backgroundPosition: `${portLeftCalc}, ${leftPanelLeft}px ${bothPanelTop}px`, backgroundImage: scrollPos === 0 ? 'none' : `url(${james}), url(${sunbeam})`};
  const bottom = { backgroundPosition: `${leftPanelLeft}px ${bothPanelTop}px` };
  const back = { backgroundPosition: `${leftPanelLeft}px ${bothPanelTop}px`, backgroundImage: scrollPos === 1 ? 'none' : `url(${trees})` };
  const right = { opacity: scrollPos * 180 % 90 ? 1 : 0 }
  
  return <section id="Hello" style={{ backgroundImage: `url(${trees})`, "--scroll":`${scrollPos}`} as React.CSSProperties}>
    <div className="hellobg2" style={{ backgroundImage: `url(${penguin})` }}></div>
    <div className="hellobg1" style={{ backgroundImage: `url(${james}), url(${sunbeam})` }} onLoad={updateScreen}></div>
    <div className={'spinContainer'}>
      <div className="helloSpinLeft">
        <div style={front} className='helloSpinPanel panel1' ref={leftPanel}><div></div></div>
        <div style={bottom} className='helloSpinPanel panel2'>I am&#8202;</div>
        <div style={back} className='helloSpinPanel panel3'>I'm a&#8202;</div>
        <div style={right} className='helloSpinPanelRight'> </div>
      </div>
      <div className="helloSpin">
        <div style={frontRight} className='helloSpinPanel panel1'>&#8202;Hello</div>
        <div style={bottomRight} className='helloSpinPanel panel2'>&#8202;James</div>
        <div style={backRight} className='helloSpinPanel panel3'>&#8202;Software Engineer</div>
      </div>
    </div>
  </section>
}

export default Hello