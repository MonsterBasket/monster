import './checkmate.css'

export default function Checkmate(mX, mY){

  return <div className="pen">
    <div className="CMa">
      <div className="CMf">CHECK MATE<br/>WITH NO MATE</div>
      <div className="CMs">SUZ SIRUNYAN<br/>DAY 67/100</div>
    </div>
    <div className="CMd"></div>
    <div className="CMb"></div>
    <div className="CMc"></div>
    <div className="CMcursor" style={{left: mX - 20 + "px", top: mY - 20 +"px"}}></div>
  </div>
}