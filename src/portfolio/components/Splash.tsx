import React, { useEffect, useState } from "react";
import Cubes from '../components/Loaders/Cubes.tsx'

type Props = {
  children: React.ReactElement|React.ReactElement[]
}

function Splash({children}:Props){
  const [done, setDone] = useState<boolean>(false)
  const [containerStyle, setContainerStyle] = useState({ overflow: "hidden" })
  const [coverStyle, setCoverStyle] = useState<React.CSSProperties>({opacity: "1", pointerEvents: "auto"})

  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      setContainerStyle({ overflow: "visible" })
      setCoverStyle({ opacity: "0", pointerEvents: "none" })
      setTimeout(() => {
        setCoverStyle({ display: "none" })
        setDone(true);
      }, 1000)
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad, false);
    }
  }, []);

  return <div className="splashContainer" style={containerStyle}>
    {children}
    {!done && <div className="splash" style={coverStyle}><Cubes /></div>}
  </div>
}

export default Splash;