import { useEffect, useRef, useState } from 'react';
import './concentric.css'

export default function Concentric({mX, mY}){
  const body = useRef()
  const boxRect = useRef()

  useEffect(() => {
    boxRect.current = body.current.getBoundingClientRect()
  },[])

  useEffect(()=>{
    if (body.current){
      body.current.style.setProperty('--x', (mX - boxRect.current.left) / document.body.clientWidth * 360 + 'deg')
      body.current.style.setProperty('--y', (mY - boxRect.current.top)  / document.body.clientHeight + 0.5 + 'turn')
    }
  },[mX,mY])

  return <div ref={body} className="pen CCbody">
    <div className="CCa">
      <div className="CCb"><div><div><div><div><div><div><div><div>
        </div></div></div></div></div></div></div></div></div>
    </div>
    <div className="CCcont">
      <div className="CCa">
        <div className="CCb"><div><div><div><div><div><div><div><div>
          </div></div></div></div></div></div></div></div></div>
      </div>
    </div>
  </div>
}
