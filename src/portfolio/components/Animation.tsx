import './CSS/animation.css'
import disclaimerImg from '../images/disclaimer.png';
import { DOMElement, ReactElement, useEffect, useRef, useState } from 'react';
import { forEachChild } from 'typescript';

type Props = {turnToCheat: number;}

export default function Animation({turnToCheat}: Props){
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
  const alleyUrl:string = "https://player.vimeo.com/video/5008288?h=22815a5165"
  const cookiesUrl:string = "https://www.youtube.com/embed/XRhsOcLPqiQ?si=wbU0P8G8_0sTDUb6"  
  const matteUrl:string = "https://youtube.com/embed/6Q-97PUTFZo?si=V3gneftIKLd2Nfk0"
  const showreelUrl:string = "https://player.vimeo.com/video/35045360?h=02bc212f2a"
  const gearsUrl:string = "https://www.youtube.com/embed/T0VNYxlmUbQ?si=jcFYfyD0epqUukZX"
  const hairUrl:string = "https://www.youtube.com/embed/D81XrEyneAA?si=jFrUNLEuW4z46LJd"
  const alley:ReactElement = <iframe src={alleyUrl} width="100%" height="100%" allow="autoplay; fullscreen; picture-in-picture" />
  const alleyDesc:string = `Brief: A 6 second abstract video synced to a music clip promoting a school event "Kick the Vendor".  I modelled the alleyway to match the photo and used (too many?) dynamic particles with physics.`
  const cookies:ReactElement = <iframe width="100%" height="100%" src={cookiesUrl} title="YouTube video player" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />
  const cookiesDesc:ReactElement = <span><h3>Cookies</h3>Flash animation that I had a lot of fun with. I lost the original render and the blurred animations (smoke, bird, trees) rendered as static in this one.</span>
  const mattePainting:ReactElement = <iframe width="100%" height="100%" src={matteUrl} title="YouTube video player" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />
  const mattePaintingDesc:string = "Animated matte painting, cutting out trees is hard!"
  const showreel:ReactElement = <iframe title="Showreel - James Blaskett 2011" src={showreelUrl} width="100%" height="100%" allow="autoplay; fullscreen; picture-in-picture"></iframe>
  const showreelDesc:string = "A compilation showing many of my works from uni after I graduated in 2011"
  const gears:ReactElement = <iframe width="100%" height="100%" src={gearsUrl} title="Dynamic Gears" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />
  const gearsDesc:string = "All the animation here is dynamic, the tall gear shown first is animated to spin, then everything else (including the swinging lights) is dynamic."
  const hair:ReactElement = <iframe width="100%" height="100%" src={hairUrl} title="MoCap Hair" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />
  const hairDesc:string = "This was a group project that was supposed to be MoCap but ended up being mostly rotoscope.  The 3D modelling was done by the other members, the mocap/roto was me, not sure if that's a self compliment or insult though..."
  const disclaimer:ReactElement = <img src={disclaimerImg} style={{width:"100%"}}></img>
  const disclaimerDesc:ReactElement = <span>Please note, all the work in this section is close to 15 years old.  This website itself is my portfolio, this is just filler content from a previous life.<br/><br/>I originally made this carousel for the menu in my game Monster Basket which you can see on my projects page.</span>
  
  // This is all good, but 
  // but what!? Why did you start writing this note?? WHAT WERE YOU TRYING TO TELL ME!!?

  return <section id="Animation">
    <article>
      <article className={`animation ${pagePos.current[0]}`}>{mattePainting}</article>
      <article className={`animation ${pagePos.current[1]}`}>{gears}</article>
      <article className={`animation ${pagePos.current[2]}`}>{cookies}</article>
      <article className={`animation ${pagePos.current[3]}`}>{alley}</article>
      <article className={`animation ${pagePos.current[4]}`}>{showreel}</article>
      <article className={`animation ${pagePos.current[5]}`}>{hair}</article>
      <div onClick={()=> move(1)} className="frontLeft ontop"></div>
      <div onClick={()=> move(-1)} className="frontRight ontop"></div>
      <div onClick={()=> move(2)} className="backLeft ontop"></div>
      <div onClick={()=> move(-2)} className="backRight ontop"></div>
      <div onClick={()=> move(-3)} className="back ontop"></div>
      <div className="animLeftButtonContainer" onClick={() => move(1)}>
        <div className="animLeftButton"></div>
      </div>
      <div className="animRightButtonContainer" onClick={() => move(-1)}>
        <div className="animRightButton"></div>
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