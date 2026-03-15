import { useEffect } from 'react';
import './concentric.css'

export default function Concentric(mX, mY){
  useEffect(() => {
    document.documentElement.style.setProperty('--x', mX / document.body.clientWidth * 360 + 'deg');
    document.documentElement.style.setProperty('--y', mY / document.body.clientHeight + 0.5 + 'turn');
  }, [mX, mY])

  return <div className="pen CCbody">
    <div class="CCa">
      <div class="CCb"><div><div><div><div><div><div><div><div>
        </div></div></div></div></div></div></div></div></div>
    </div>
    <div class="CCcont">
      <div class="CCa">
        <div class="CCb"><div><div><div><div><div><div><div><div>
          </div></div></div></div></div></div></div></div></div>
      </div>
    </div>
  </div>
}
