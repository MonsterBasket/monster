import './CSS/work.css'
import cookiesImg from "../images/cookies.webp"
import gearsImg from "../images/gears.webp"
import hairImg from "../images/hair.webp"
import allyImg from "../images/kickthevendor.webp"
import matteImg from "../images/matte.webp"
import showreelImg from "../images/showreel.webp"
import { ReactElement, useEffect, useRef, useState } from 'react';

type Props = {turnToCheat: number;}

export default function Work({turnToCheat}: Props){
  const xTouch = useRef<number>(0);
  const yTouch = useRef<number>(0);

  const pagePos = useRef<string[]>(["front","frontRight","backRight","back","backLeft","frontLeft"])
  const descPos = useRef<string[]>(["frontD","frontRightD","backRightD","backD","backLeftD","frontLeftD"])
  const [,rerender] = useState<string[]>([])

  useEffect(() => {
    if(turnToCheat == 2) {
      window.addEventListener('touchstart', handleTouchStart, false);
      window.addEventListener('touchmove', handleTouchMove, false);
    }
    else {
      window.removeEventListener('touchstart', handleTouchStart, false);        
      window.removeEventListener('touchmove', handleTouchMove, false);
    }
    return () => {
      window.removeEventListener('touchstart', handleTouchStart, false);        
      window.removeEventListener('touchmove', handleTouchMove, false);
    };  
  }, [turnToCheat])

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
        move(-1)
      } else {
        /* left swipe */
        move(1)
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
    return false;
  }

  function move(direction:number){
    function num(i:number){
      i += direction;
      if (i > 5) i -= 6
      if (i < 0) i += 6
      return i
    }
    pagePos.current = [pagePos.current[num(0)], pagePos.current[num(1)], pagePos.current[num(2)], pagePos.current[num(3)], pagePos.current[num(4)], pagePos.current[num(5)]]
    descPos.current = [descPos.current[num(0)], descPos.current[num(1)], descPos.current[num(2)], descPos.current[num(3)], descPos.current[num(4)], descPos.current[num(5)]]
    rerender([])
  }
  const alleyAlt:string = ""
  const cookiesAlt:string = ""
  const matteAlt:string = ""
  const showreelAlt:string = ""
  const gearsAlt:string = ""
  const hairAlt:string = ""

  const alleyUrl:string = "https://player.vimeo.com/video/5008288?h=22815a5165"
  const cookiesUrl:string = "https://www.youtube.com/embed/XRhsOcLPqiQ?si=wbU0P8G8_0sTDUb6"  
  const matteUrl:string = "https://youtube.com/embed/6Q-97PUTFZo?si=V3gneftIKLd2Nfk0&enablejsapi=1"
  const showreelUrl:string = "https://player.vimeo.com/video/35045360?h=02bc212f2a"
  const gearsUrl:string = "https://www.youtube.com/embed/T0VNYxlmUbQ?si=jcFYfyD0epqUukZX"
  const hairUrl:string = "https://www.youtube.com/embed/D81XrEyneAA?si=jFrUNLEuW4z46LJd"
  const alley:ReactElement = <a href={alleyUrl} target="_blank" rel="noreferrer"><img alt={alleyAlt} src={allyImg} style={{left:"-20%"}}></img></a>
  const cookies:ReactElement = <a href={cookiesUrl} target="_blank" rel="noreferrer"><img alt={cookiesAlt} src={cookiesImg} style={{left:"-75%"}}></img></a>
  const mattePainting:ReactElement = <a href={matteUrl} target="_blank" rel="noreferrer"><img alt={matteAlt} src={matteImg} style={{left:"-40%"}}></img></a>
  const showreel:ReactElement = <a href={showreelUrl} target="_blank" rel="noreferrer"><img alt={showreelAlt} src={showreelImg} style={{left:"-20%"}}></img></a>
  const gears:ReactElement = <a href={gearsUrl} target="_blank" rel="noreferrer"><img alt={gearsAlt} src={gearsImg} style={{left:"-15%"}}></img></a>
  const hair:ReactElement = <a href={hairUrl} target="_blank" rel="noreferrer"><img alt={hairAlt} src={hairImg} style={{left:"-40%"}}></img></a>
  const alleyDesc:ReactElement = <span><a href={alleyUrl} target="_blank" rel="noreferrer"><h3>Kick the Vendor</h3></a>Brief: A 6 second abstract video synced to a music clip promoting a school event "Kick the Vendor".  I modelled the alleyway to match the photo and used (too many?) dynamic particles with physics.</span>
  const cookiesDesc:ReactElement = <span><a href={cookiesUrl} target="_blank" rel="noreferrer"><h3>Cookies</h3></a>Flash animation that I had a lot of fun with. I lost the original render and the blurred animations (smoke, bird, trees) rendered as static in this one.</span>
  const mattePaintingDesc:ReactElement = <span><a href={matteUrl} target="_blank" rel="noreferrer"><h3>Matte Painting</h3></a>Animated matte painting, cutting out trees is hard!</span>
  const showreelDesc:ReactElement = <span><a href={showreelUrl} target="_blank" rel="noreferrer"><h3>3D Showreel (Modelling, Rigging and Animation)</h3></a>A compilation showing many of my works from uni after I graduated in 2011</span>
  const gearsDesc:ReactElement = <span><a href={gearsUrl} target="_blank" rel="noreferrer"><h3>Dynamic Gears Simulation</h3></a>All the animation here is dynamic, the tall gear shown first is animated to spin, then everything else (including the swinging lights) is dynamic.</span>
  const hairDesc:ReactElement = <span><a href={hairUrl} target="_blank" rel="noreferrer"><h3>MoCap Hair</h3></a>This was a group project that was supposed to be MoCap but ended up being mostly rotoscope.  The 3D modelling was done by the other members, the mocap/roto was me, not sure if that's a self compliment or insult though...</span>
  
  // This is all good, but 
  // but what!? Why did you start writing this note?? WHAT WERE YOU TRYING TO TELL ME!!?

  return <section id="Work">
    <article>
      <article className={`work ${pagePos.current[0]}`}>{mattePainting}</article>
      <article className={`work ${pagePos.current[1]}`}>{gears}</article>
      <article className={`work ${pagePos.current[2]}`}>{cookies}</article>
      <article className={`work ${pagePos.current[3]}`}>{alley}</article>
      <article className={`work ${pagePos.current[4]}`}>{showreel}</article>
      <article className={`work ${pagePos.current[5]}`}>{hair}</article>
      <div onClick={()=> move(1)} className="frontLeft ontop"></div>
      <div onClick={()=> move(-1)} className="frontRight ontop"></div>
      <div onClick={()=> move(2)} className="backLeft ontop"></div>
      <div onClick={()=> move(-2)} className="backRight ontop"></div>
      <div onClick={()=> move(-3)} className="back ontop"></div>
      <div className="workLeftButtonContainer" onClick={() => move(-1)}>
        <div className="workLeftButton"></div>
      </div>
      <div className="workRightButtonContainer" onClick={() => move(1)}>
        <div className="workRightButton"></div>
      </div>
    </article>
    <div className="descContainer">
      <div className={`${descPos.current[0]}`}>{mattePaintingDesc}</div>
      <div className={`${descPos.current[1]}`}>{gearsDesc}</div>
      <div className={`${descPos.current[2]}`}>{cookiesDesc}</div>
      <div className={`${descPos.current[3]}`}>{alleyDesc}</div>
      <div className={`${descPos.current[4]}`}>{showreelDesc}</div>
      <div className={`${descPos.current[5]}`}>{hairDesc}</div>
    </div>
  </section>
}