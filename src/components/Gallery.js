import "../CSS/gallery.css"
import { useBodyScrollPosition } from "@n8tb1t/use-scroll-position"

export default function Gallery(){

  useBodyScrollPosition(({ prevPos, currPos }) => {
    // setScroll((currPos.y / window.innerHeight - window.innerHeight) * 100)
    document.documentElement.style.setProperty('--scroll', (1 + currPos.y / window.innerHeight) / 2)
  })
  const topText = "This website is still under construction!"
  const bottomText = "Our first game 'In Good Spirits' is\ncurrently in very early Alpha development\u00A0\u00A0"
  const text1 = "Fight against the evil spirits";
  const text2 = "Traverse challenging terrain";
  const text3 = "Face epic bosses";
  
  return <>
    <div id="gallery">
      <div className="picCon">
        <div className="gallery"></div>
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