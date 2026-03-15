import './commonsense.css'

export default function CommonSense(mX, mY){
  reset()
  document.querySelector(".suz").addEventListener("mouseover", e => hover(2))
  document.querySelector(".isnot").addEventListener("mouseover", e => hover(2))
  document.querySelector(".suz").addEventListener("mouseout", reset)
  document.querySelector(".isnot").addEventListener("mouseout", reset)

  function hover(num){
    document.documentElement.style.setProperty('--h', num)
    document.documentElement.style.setProperty('--c', 1 / num)
  }
  function reset(){
    document.documentElement.style.setProperty('--h', 0)
    document.documentElement.style.setProperty('--c', 1)
  }
  return <div className="pen CSbody">
    <div class="CSCont">
      <div class="CScommon"><span>COMMON</span></div>
      <div class="CSmenu">
        <span>100 DAYS OF</span>
        <span>DESIGN CHALLENGE</span>
        <span class="CSsuz">BY SUZ SIRUNYAN</span>
        <span>HOVER INTERACTION</span>
        <span>DAY 78/100</span>
      </div>
      <div class="CSisnot"><span>IS NOT SO COMMON</span></div>
      <div class="CSsense"><span>SENSE</span></div>
    </div>
    <div className="CScursor" style={{left: mX - 7.5 + "px", top: mY - 7.5 +"px"}}></div>
  </div>
}
