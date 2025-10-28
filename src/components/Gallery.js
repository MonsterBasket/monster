import { useEffect } from "react"
import "../CSS/gallery.css"
import { useBodyScrollPosition } from "@n8tb1t/use-scroll-position"

export default function Gallery(){

  useBodyScrollPosition(({ prevPos, currPos }) => {
    // setScroll((currPos.y / window.innerHeight - window.innerHeight) * 100)
    document.documentElement.style.setProperty('--scroll', (1 + currPos.y / window.innerHeight) / 2)
  })
  
  return <>
    <div id="gallery">
      <div className="picCon">
        <div className="gallery"></div>
        <div className="galSpin"  style={{"--index": "1s"}}>
          <div className="galPic"/>
        </div>
        <div className="galSpin"  style={{"--index": "3s"}}>
          <div className="galPic"/>
        </div>
        <div className="galSpin"  style={{"--index": "5s"}}>
          <div className="galPic"/>
        </div>
      </div>
    </div>
  </>
}