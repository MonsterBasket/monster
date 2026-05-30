import { useEffect, useRef } from "react"

export default function Goofall({scroll}){
  const canvas = useRef();
  const bubbles = useRef([])
  const delta = useRef();
  const aniTimer = useRef();
  const scrollY = useRef(0);
  const lastScroll = useRef(0);
  const rate = useRef(1);

  useEffect(() => {scrollY.current = scroll || 0}, [scroll])

  useEffect(() =>{
    const ctx = canvas.current.getContext("2d");
    ctx.canvas.width = ctx.canvas.parentElement.offsetWidth * 0.2;
    ctx.canvas.height = ctx.canvas.parentElement.offsetHeight * 2.1;
    const xp = ctx.canvas.width / 100; // % of canvas width (canvas is slightly oversized)
    const yp = ctx.canvas.height / 100; // to hide sides and bottom

    // ---------------------------------------------------------------------------------------------------
    // ----------------------------------- Draw circles --------------------------------------------------
    // ---------------------------------------------------------------------------------------------------
    function circle(x, y, r){
      const oR = r; // original radius (actually diameter)
      x = x*xp + r*xp/2 + 2.5*xp; // original x/y is top left, canvas draws circles from centre
      y = y*yp + r*xp/2;
      r = r*xp / 2  // converts diameter to radius at % of screen width

      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI); // initial circle
      ctx.fill();
      // base color with slight 3D shading
      const gradient = ctx.createRadialGradient(x, y, r / 2, x, y, r) 
      gradient.addColorStop(0.6, "#165529")
      gradient.addColorStop(1, "#133f20")
      fill(gradient);
      // shine
      const gradient2 = ctx.createRadialGradient(x - r/1.9, y - r / 1.9, r/oR, x - r/1.9, y-r/1.9, r/1.5) 
      gradient2.addColorStop(0, "#7bbd9052")
      gradient2.addColorStop(0.5, "transparent")
      fill(gradient2);
      // shadow
      const gradient3 = ctx.createRadialGradient(x - r/2, y - r /1.9, r, x - r/2, y - r /1.9, r * 2.1) 
      gradient3.addColorStop(0, "transparent")
      gradient3.addColorStop(0.7, "#0008")
      fill(gradient3);

      function fill(gradient){
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // ---------------------------------------------------------------------------------------------------
    // ------------------------------------- Main loop ---------------------------------------------------
    // ---------------------------------------------------------------------------------------------------
    function main(now, last, bY){ // bY = box Y
      delta.current = now - last;
      last = now;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // --------------------- all bubble calculations ---------------------
      const b = bubbles.current
      // for (let i = 0; i < b.length; i++) {
      //   circle(b[i][1], b[i][3], b[i][4]) // draws all bubbles
      //   b[i][1] += (0.001 * b[i][6] * delta.current)  // x movement
      //   b[i][3] += (0.001 * b[i][7] * delta.current)  // y movement
      // }
      circle(20, 70, 20)
      circle(24, 69, 12)
      console.log(scrollY.current)
      aniTimer.current = requestAnimationFrame(t => main(t, last, bY))
    }
    aniTimer.current = requestAnimationFrame(t => main(t, t - 16, 104));

    
    function tabbed(){
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(aniTimer.current)
      } else if (document.visibilityState === "visible") {
        aniTimer.current = requestAnimationFrame(t => main(t, t - delta.current, 104));
      }
    }  

    document.addEventListener('visibilitychange', tabbed, false)
    return () => {
      document.removeEventListener('visibilitychange', tabbed, false)
    }
  },[])

  return <canvas className="gooFall" ref={canvas} />
}