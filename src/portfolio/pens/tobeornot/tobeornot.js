import { useEffect, useRef } from 'react';
import './tobeornot.css'

export default function Tobeornot({mX,mY}){
  const body = useRef()
  const boxRect = useRef({left:0, top:0})

  useEffect(() => {
    boxRect.current = body.current.getBoundingClientRect()
  },[])

  useEffect(()=>{
    // some dirty magic numbers here, I'll explain these at https://www.linkedin.com/article/7270727866630205440/
    const z = Math.min(Math.max((mX / window.innerWidth * 4 + 3), 3.7), 6.2);
    body.current.style.setProperty('--z', '-' + z + 's');
  }, [mX,mY])

  return <div ref={body} className="pen TBbody">
    <div className="TBcont">
      <div className="TBa">TO BE OR</div>
      <div className="TBskull"><div></div></div>
      <div className="TBb">NOT TO BE</div>
    </div>
    <div className="TBcursor" style={{left: mX - boxRect.current.left - 7.5 + "px", top: mY - boxRect.current.top - 7.5 +"px"}}></div>
  </div>
}
