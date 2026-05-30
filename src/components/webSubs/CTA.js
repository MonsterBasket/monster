import { useEffect, useRef } from "react";
import { splats, circles } from "./splats.js"

export default function CTA({text, a}){
  const link = useRef();
  const cta = useRef();
  const canvas = useRef();
  const clicked = useRef(false);

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    ctx.canvas.width = cta.current.getBoundingClientRect().width * 2;
    ctx.canvas.height = cta.current.getBoundingClientRect().height * 4;
    const xp = ctx.canvas.width / 100;
    const yp = ctx.canvas.height / 100;
    let aniTimer;
    const linkNode = link.current;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#133f20";
    // ctx.fillStyle = "green"
    function circle([x, y, r]){
      ctx.beginPath();
      ctx.arc(x*xp, y*yp, r*xp/10, 0, 2 * Math.PI);
      ctx.fill();
    }

    function updatePos(now, lastUpdate, back) {
      const delta = now - lastUpdate;
      lastUpdate = now;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      for (let i = 0; i < circles.length; i++) {
        circle(circles[i][0])
      }
      if (!lastUpdate || clicked.current) return
      let done = true;
      for (let i = 0; i < circles.length; i++) {
        if (!back){
          if (circles[i][0][1] < circles[i][2][1]) done = false;
          else continue;
          circles[i][0][1] += (circles[i][2][1] - circles[i][1][1]) * delta * circles[i][3] * 0.0005;
        }
        else {
          if (circles[i][0][1] > circles[i][1][1]) done = false;
          else continue;
          circles[i][0][1] -= (circles[i][2][1] - circles[i][1][1]) * delta * circles[i][3] * 0.0005;
        }
      }
      if (done) cancelAnimationFrame(aniTimer);
      else aniTimer = requestAnimationFrame(t => updatePos(t, lastUpdate, back));
    }
    updatePos(0, 0, 0)

    function hover(e, back = 0){
      e.stopPropagation()
      if (clicked.current) return;
      cancelAnimationFrame(aniTimer);
      requestAnimationFrame(t => updatePos(t, t, back));
    }

    function click(e){
      e.preventDefault();
      e.stopPropagation()
      if (clicked.current) return;
      requestAnimationFrame(t => splat(t, 0));
      const target = this.href
      // setTimeout(() => window.open(target, '_blank'), 250)
    }

    function splat(now, lastUpdate){
      const delta = now - lastUpdate;
      if (!lastUpdate) {
        cancelAnimationFrame(aniTimer);
        clicked.current = true;
        requestAnimationFrame(t => splat(t, now));
        return
      }
      lastUpdate = now;
      updatePos(0, 0, 0)
      let done = true;
      //  current       start         stop        x, y, r  
      //  [i][0]        [i][1]        [i][2]     [0][1][2]
      for (let i = 0; i < splats.length; i++) {
        if (Math.abs(splats[i][2][0] - splats[i][0][0]) > 0.05) {splats[i][0][0] += ((splats[i][2][0] - splats[i][1][0]) * delta * 0.01); done = false;}
        if (Math.abs(splats[i][2][1] - splats[i][0][1]) > 0.05) {splats[i][0][1] += ((splats[i][2][1] - splats[i][1][1]) * delta * 0.01); done = false;}
        circle(splats[i][0])
      }
      if (done) cancelAnimationFrame(aniTimer);
      else aniTimer = requestAnimationFrame(t => splat(t, lastUpdate));
    }

    if (linkNode){
      linkNode.addEventListener("pointerdown", click)
      linkNode.addEventListener("mouseover", hover)
      linkNode.addEventListener("focus", hover)
      linkNode.addEventListener("mouseout", e => hover(e, 1))
      linkNode.addEventListener("blur", e => hover(e, 1))
      return () => {
        linkNode.removeEventListener("pointerdown", click)
        linkNode.removeEventListener("mouseover", hover)
        linkNode.removeEventListener("focus", hover)
        linkNode.removeEventListener("mouseout", e => hover(e, 1))
        linkNode.removeEventListener("blur", e => hover(e, 1))
      }
    }
  }, [])

  return <div ref={cta} className="cta">
    <canvas ref={canvas} ></canvas>
    <a ref={link} href={a} rel="noreferrer">{text}</a>
  </div>
}