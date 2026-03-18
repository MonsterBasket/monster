import { useEffect, useRef } from 'react'
import './commonSense.css'

export default function CommonSense({mX, mY}){
  const body = useRef()
  const boxRect = useRef()
  const suz = useRef();
  const isnot = useRef();

  useEffect(()=>{
    reset()
    boxRect.current = body.current.getBoundingClientRect()
    const suzNode = suz.current;
    const isnotNode = isnot.current;

    if (suzNode && isnotNode){
      suzNode.addEventListener("mouseover", _ => hover(2));
      isnotNode.addEventListener("mouseover", _ => hover(2));
      suzNode.addEventListener("mouseout", reset);
      isnotNode.addEventListener("mouseout", reset);
      return () => {
        suzNode.removeEventListener("mouseover", _ => hover(2));
        isnotNode.removeEventListener("mouseover", _ => hover(2));
        suzNode.removeEventListener("mouseout", reset);
        isnotNode.removeEventListener("mouseout", reset);
      }
    }
  },[])

  useEffect(() => {
    body.current.style.setProperty('--x', mX - boxRect.current.left + 'px');
    body.current.style.setProperty('--y', mY - boxRect.current.top  + 'px');
  }, [mX, mY])

  function hover(num){
    body.current.style.setProperty('--h', num)
    body.current.style.setProperty('--c', 1 / num)
  }
  function reset(){
    body.current.style.setProperty('--h', 0)
    body.current.style.setProperty('--c', 1)
  }
  return <div ref={body} className="pen CSbody">
    <div className="CSCont">
      <div className="CScommon"><span>COMMON</span></div>
      <div className="CSmenu">
        <span>100 DAYS OF</span>
        <span>DESIGN CHALLENGE</span>
        <span ref={suz} className="CSsuz">BY SUZ SIRUNYAN</span>
        <span>HOVER INTERACTION</span>
        <span>DAY 78/100</span>
      </div>
      <div className="CSisnotCont">
        <div ref={isnot} className="CSisnot"><span>IS NOT SO COMMON</span></div>
      </div>
      <div className="CSsense"><span>SENSE</span></div>
    </div>
    <div className="CScursor"></div>
  </div>
}
