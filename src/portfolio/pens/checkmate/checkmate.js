import { useEffect, useRef } from 'react'
import './checkmate.css'

export default function Checkmate({mX, mY}){
  const body = useRef();
  const boxRect = useRef()

  useEffect(() => {
    boxRect.current = body.current.getBoundingClientRect()
  },[])

  useEffect(() => {
    body.current.style.setProperty('--x', mX - boxRect.current.left + 'px');
    body.current.style.setProperty('--y', mY - boxRect.current.top  + 'px');
  }, [mX, mY])

  return <div ref={body} className="pen CMbody">
    <div className="CMa"></div>
    <div className="CMd"></div>
    <div className="CMb"></div>
    <div className="CMc">
      <div className="CMf">CHECK MATE<br/>WITH NO MATE</div>
      <div className="CMs">SUZ SIRUNYAN<br/>DAY 67/100</div>
    </div>
    <div className="CMcursor"></div>
  </div>
}