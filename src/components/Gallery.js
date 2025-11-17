import { useRef } from "react"
import "../CSS/gallery.css"
import { useBodyScrollPosition } from "@n8tb1t/use-scroll-position"

export default function Gallery(){
  const gallery = useRef();
  const timing1 = useRef(true);
  const timing2 = useRef(true);

  useBodyScrollPosition(({ prevPos, currPos }) => {
    const scrollPos = (1 + currPos.y / window.innerHeight) / 2
    document.documentElement.style.setProperty('--scroll', scrollPos)
    if ((timing1.current && scrollPos < -0.7) || (!timing1.current && scrollPos > -0.7)){
      reverseTiming(1);
      reverseTiming(2);
      reverseTiming(3);
      timing1.current = !timing1.current;
    }
    if ((timing2.current && scrollPos < -0.2) || (!timing2.current && scrollPos > -0.2)){
      reverseTiming(4);
      reverseTiming(5);
      reverseTiming(6);
      timing2.current = !timing2.current;
    }
  })

  function reverseTiming(num){
    const timing = window.getComputedStyle(gallery.current).getPropertyValue(`--timing${num}`)
    const x1 = (1 - Number(timing.substr(25,4))).toFixed(2)
    const x2 = (1 - Number(timing.substr(31,4))).toFixed(2)
    const y1 = (1 - Number(timing.substr(13,4))).toFixed(2)
    const y2 = (1 - Number(timing.substr(19,4))).toFixed(2)
    const newTiming = `cubic-bezier(${x1}, ${x2}, ${y1}, ${y2})`
    gallery.current.style.setProperty(`--timing${num}`, newTiming)
  }

  const topText = "This website is still under construction!"
  const bottomText = "Our first game 'In Good Spirits' is\ncurrently in very early Alpha development\u00A0\u00A0"
  const text1 = "Fight against the evil spirits";
  const text2 = "Traverse challenging terrain";
  const text3 = "Face epic bosses";
  
  return <>
    <div id="gallery">
      <div className="picCon">
        <div className="gallery" ref={gallery}>
          <div className="galbendcont1"><div className="galbend1"/></div>
          <div className="galbendcont2"><div className="galbend2"/></div>
          <div className="galbendcont3"><div className="galbend3"/></div>
          <div className="galbendcont4"><div className="galbend4"/></div>
          <div className="galbendcont5"><div className="galbend5"/></div>
          <div className="galbendcont6"><div className="galbend6"/></div>
        </div>
        <div className="galTop">{topText}</div>
        <div className="galBot">{bottomText}</div>
        <div className="galSpin" style={{"--index": "1s"}}>
          <div className="galPic"/>
          <div className="galText" style={{"--index": "1s"}}>{text1}</div>
        </div>
        <div className="galSpin" style={{"--index": "3s"}}>
          <div className="galPic"/>
          <div className="galText" style={{"--index": "3s"}}>{text2}</div>
        </div>
        <div className="galSpin" style={{"--index": "5s"}}>
          <div className="galPic"/>
          <div className="galText" style={{"--index": "5s"}}>{text3}</div>
        </div>
      </div>
    </div>
  </>
}