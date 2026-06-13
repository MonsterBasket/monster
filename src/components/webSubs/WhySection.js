import { useEffect, useRef, useState } from "react"
import Goofall from "./Goofall";

export default function WhySection({scroll}){
  const canvas = useRef();
  const bubbles = useRef(new Array(12).fill(0).map(() => new Array(5).fill(0))); // 0-5 are left, 6-11 right, 12-32 bottom
  const floaters = useRef([])
  const popped = useRef([])
  const active = useRef(null);
  const delta = useRef();
  const aniTimer = useRef();
  const T01 = useRef() // I feel like an array or object should be possible, but damned if I can get it to work.
  const T02 = useRef()
  const T03 = useRef()
  const T04 = useRef()
  const T05 = useRef()
  // I initially had the two headers in this list too, hence no T00 or T06
  const T07 = useRef()
  const T08 = useRef()
  const T09 = useRef()
  const T10 = useRef()
  const T11 = useRef()
  const mouse = useRef({x:0, y:0})
  const [transition, setTransition] = useState("0.4s ease");
  const paused = useRef(false)

  useEffect(() =>{
    setTransition("0.4s ease")
    if (scroll > 60) paused.current = true;
    if (scroll < 60) paused.current = false;
  }, [scroll])

  useEffect(() =>{
    const ctx = canvas.current.getContext("2d");
    ctx.canvas.width = ctx.canvas.parentElement.offsetWidth;
    ctx.canvas.height = ctx.canvas.parentElement.offsetHeight;
    const xp = ctx.canvas.width / 105; // % of screen width (canvas is slightly oversized)
    const yp = ctx.canvas.height / 102.5; // to hide sides and bottom

    bubbles.current = [
    // Left section
    // x origin, x current, y origin, y current, size, scaleY, x speed, y speed (negative speed is moving left)
    [ 1,  1,  4,  4, 25, 0.5],
    [10, 10, 25, 25,  8, 1, Math.random() - 0.5, Math.random() - 0.5],
    [ 7,  7, 39, 39,  8, 1, Math.random() - 0.5, Math.random() - 0.5],
    [12, 12, 52, 52,  8, 1, Math.random() - 0.5, Math.random() - 0.5],
    [ 8,  8, 64, 64,  8, 1, Math.random() - 0.5, Math.random() - 0.5],
    [11, 11, 79, 79,  8, 1, Math.random() - 0.5, Math.random() - 0.5],

    // Right section
    [55, 55,  2,  2, 37, 0.5],
    [72, 72, 35, 35,  8, 1, Math.random() - 0.5, Math.random() - 0.5],
    [78, 78, 44, 44,  8, 1, Math.random() - 0.5, Math.random() - 0.5],
    [74, 74, 55, 55,  8, 1, Math.random() - 0.5, Math.random() - 0.5],
    [76, 76, 70, 70,  8, 1, Math.random() - 0.5, Math.random() - 0.5],
    [82, 82, 80, 80,  8, 1, Math.random() - 0.5, Math.random() - 0.5]]

    // Pool / bottom bubbles
    for (let i = 0; i < 31; i++) {
      const x = ((i * 3.3) - Math.random()) - 2;
      const s = Math.random() * 2 + 6;
      const scale = Math.random() + 2 * Math.sign(Math.random() - 0.5)
      bubbles.current.push([x, x, 100-s, 100-s, s, 2, scale]) // scale = pool identifier, x speed = rate of scale.
    }

    // ---------------------------------------------------------------------------------------------------
    // ----------------------------------- Draw circles --------------------------------------------------
    // ---------------------------------------------------------------------------------------------------
    function circle(x, y, r, s){
      const oR = r; // original radius (actually diameter)
      x = x*xp + r*xp/2 + 2.5*xp; // original x/y is top left, canvas draws circles from centre
      y = y*yp + r*xp/2;
      r = Math.max(r*xp / 2, 0)  // converts diameter to radius at % of screen width

      if (s < 1) {
        ctx.save() 
        ctx.scale(1, s)
      }
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI); // initial circle
      ctx.fill();
      let gradient;
      try{
        gradient = ctx.createRadialGradient(x, y, r / 2, x, y, r) // base color with slight 3D shading
      }
      catch (error) {
        console.log(error)
        console.log(`x: ${x}, y: ${y}, r: ${r}, s: ${s}`)
      }
      if (s === 3) { // floaters only
        gradient.addColorStop(0.6, "#708a33")
        gradient.addColorStop(1, "#5c7426")
      } else {
        gradient.addColorStop(0.6, "#165529")
        gradient.addColorStop(1, "#133f20")
      }
      fill(gradient);
      const yy = s !== 2 ? 1.9 : 1.25; // bottom pool 1.25 / everything else 1.9
      const xx = s !== 2 ? 1.9 : 3;    // bottom pool 3    / everything else 1.9
      const gradient2 = ctx.createRadialGradient(x - r/xx, y - r / yy, r/oR, x - r/xx, y-r/yy, r/1.5) // adds shine
      gradient2.addColorStop(0, "#7bbd9052")
      gradient2.addColorStop(0.5, "transparent")
      fill(gradient2);
      if (s !== 2){
        const gradient3 = ctx.createRadialGradient(x - r/2, y - r /1.9, r, x - r/2, y - r /1.9, r * 2.1) // shadow (not for bottom bubbles)
        gradient3.addColorStop(0, "transparent")
        gradient3.addColorStop(0.7, s !== 1 ? "#0003" : "#0008")
        fill(gradient3);
      }
      if (s < 1) ctx.restore()

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
      // --------------------- calculates all floaters (must be first to go behind others) ---------------------
      const f = floaters.current
      let pop = null;
      for (let i = 0; i < f.length; i++) {
        circle(f[i][1], f[i][2], f[i][3], 3) // draw
        f[i][2] -= 0.01 * f[i][5] * delta.current;   // y constant movement
        f[i][1] += 0.005 * f[i][4] * delta.current   // x movement
          if (Math.abs(f[i][1] - f[i][0]) > 1){ // determines left and right movement bounds to 1vw of start pos.
            f[i][4] = -Math.sign(f[i][4]) * Math.random() * 0.5; // change direction and pick new speed.
          }
        if (f[i][3] <= 6){                 // while size is < 6
          f[i][3] += 0.002 * delta.current;        // increase size
          f[i][1] -= 0.001 * delta.current;        // adjust x pos for size
          f[i][2] -= 0.001 * delta.current;        // adjust y pos for size
        }
        const r = f[i][3] / 2              // radius
        const xc = f[i][1]*xp + r*xp             // x pos center
        const yc = f[i][2]*yp + r*xp             // y pos center
        const distx = xc - mouse.current.x
        const disty = yc - mouse.current.y
        const distS = distx**2 + disty**2
        if (distS < (r*xp * r*xp) || f[i][2] < 0){
          pop = i;
        }
      }
      // --------------------------- popped floaters -------------------------------
      if (pop != null) {
        // wait until for loop is done and then delete - if two need to be deleted on the exact same frame 
        // (uncommon, but possible) the lower index will get picked up again next frame.
        const w = f[pop][3] - 2
        let x = f[pop][1] + (w / 2);
        let y = f[pop][2] + (w / 2);
        for (let i = 0; i < Math.random() * 5 + 3; i++) {
          const xs = Math.random() * -1 + 0.5;
          const ys = Math.random() * -1 - 1;
          x += Math.random() * w - (w / 2)
          y += Math.random() * w - (w / 2)
          popped.current.push([x, y, 2, xs, ys])
        }
        f.splice(pop,1)
      }
      const p = popped.current;
      let kill = null;
      for (let i = 0; i < p.length; i++) {
        circle(p[i][0], p[i][1], p[i][2], 3)
        p[i][0] += 0.025 * p[i][3] * delta.current;
        p[i][1] += 0.025 * p[i][4] * delta.current;
        p[i][4] += 0.005 * delta.current;
        if (p[i][1] > 100) kill = i
      }
      if (kill != null) p.splice(kill,1);
      // --------------------- all bubble calculations ---------------------
      const b = bubbles.current
      ctx.fillStyle = "#165529";
      ctx.fillRect(0, 96*yp, 110*xp, 10*yp) // Draws a square behind the bubbles at the bottom - occasionally the random position leaves a small gap.

      for (let i = 0; i < b.length; i++) {
        circle(b[i][1], b[i][3], b[i][4], b[i][5]) // draws all bubbles
        if (i > 0 && i < 12 && i !== 6){        // selects the 10 details bubbles
          b[i][1] += (0.001 * b[i][6] * delta.current)  // x movement
          if (Math.abs(b[i][1] - b[i][0]) > 3){ // determines left and right movement bounds to 3vw of start pos.
            b[i][6] = -Math.sign(b[i][6]) * Math.random() * 0.5; // change direction and pick new speed.
          }
          b[i][3] += (0.001 * b[i][7] * delta.current)  // y movement
          if (Math.abs(b[i][3] - b[i][2]) > 1.5){ // determines top and bottom movement bounds to 1.5vh of start pos.
            b[i][7] = -Math.sign(b[i][7]) * Math.random() * 0.5; // change direction and pick new speed.
          }
        }
        if (i > 11) { // All the bottom (pool) bubbles
          b[i][4] += (0.001 * b[i][6] * delta.current)   //change size
          b[i][1] -= (0.001 * b[i][6]/2 * delta.current) //adjust x pos for size
          b[i][3] -= (0.001 * b[i][6]/2 * delta.current) //adjust y pos for size
          if (Math.abs(b[i][4] - 7) > 1){
            if (b[i][4] > 8 && Math.random() > 0.98){ // 1 in 20 chance when bubble is at max size - pops and spawns floater
              b[i][1] += (b[i][4] - 6) / 2           // change x to match size
              b[i][3] += (b[i][4] - 6) / 2           // change y to match size
              b[i][4] = 6                            // shrink bubble to smallest size
              b[i][6] = Math.random() + 1            // new speed is positive and slow

              const x = b[i][1] + 1.5                // x initial and current pos
              const mx = Math.random() - 0.5         // x speed
              const my = Math.random() + 0.5         // y speed
              floaters.current.push([x, x, 90, 2, mx, my])
            }
            else {
              if (b[i][4] < 6) b[i][4] = 6;
              b[i][6] = -Math.sign(b[i][6]) * (Math.random() * 2 + 1); // change direction and pick new speed.
            }
          }
        }
      }
      updateStyle() // updates position of summary divs to match drawn bubbles
      // --------------------- draws box for expanded details - 44 and 104 are position from top ---------------------
      if (bY < 104 || active.current){
        if (active.current && bY >= 44) bY -= delta.current * 0.06;
        else if (!active.current) bY += delta.current * 0.06;
        if (bY < 44) bY = 44;
        ctx.fillStyle = "#133f20";
        ctx.fillRect(27*xp + 2.5*xp, bY*yp, 28*xp + 4*xp, 21*yp + 8.5*yp) // detail open text (shadow)
        ctx.fillStyle = "#165529";
        ctx.fillRect(27.5*xp + 2.5*xp, bY*yp + 0.5*yp, 26.5*xp + 4*xp, 18*yp + 8.5*yp) // detail open text (main colour)
      }
      aniTimer.current = requestAnimationFrame(t => nextFrame(t, last, bY))
    }
    function pausedLoop(now, last, bY){ // required to restart the main loop on unpause
      delta.current = now - last;
      last = now;
      aniTimer.current = requestAnimationFrame(t => nextFrame(t, last, bY))
    }
    window.onload = () => {aniTimer.current = requestAnimationFrame(t => main(t, t - 16, 104));}

    function nextFrame(t, last, bY){
      if (paused.current) pausedLoop(t, last, bY)
      else                main(t, last, bY)
    }

    function tabbed(){
      cancelAnimationFrame(aniTimer.current)
      if (document.visibilityState === "visible") {
        aniTimer.current = requestAnimationFrame(t => main(t, t - delta.current, 104));
      }
    }  

    window.addEventListener("mousemove", getCoords, false)
    document.addEventListener('visibilitychange', tabbed, false)
    return () => {
      window.removeEventListener("mousemove", getCoords, false)
      document.removeEventListener('visibilitychange', tabbed, false)
    }
  },[])

  function toggle(e, n){
    if (e.newState === "open") active.current = n
    else if (e.newState === "closed" && !active.current) active.current = null
    else if (e.newState === "closed" && active.current === n) active.current = null
  }

  function updateStyle(){
    const t = [T01, T02, T03, T04, T05, T07, T08, T09, T10, T11]
    let c = 1;
    t.forEach(t => {
      // t.current.style.transform = `translate(${bubbles.current[c][1]}vw, ${bubbles.current[c][3]}vh)`
      t.current.style.left = `${bubbles.current[c][1]}vw`
      t.current.style.top  =`${bubbles.current[c][3]}vh`
      c++
      if (c === 6) c++
    })
  }

  function getCoords(e){
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
  }

  return <>
    <div className="whyFilter">
      <Goofall scroll={scroll} paused={paused.current}/>
      <canvas ref={canvas}></canvas>
    </div>
    <div className="bubble header1">
      <h2>Why do you need a website?</h2>
      <p>Since you're reading this on my website that sells websites, you probably already know.  But if you don't, here are 5 reasons why having a website can be beneficial to your business.</p>
    </div>
    <details name="why" className="bubble" ref={T01} style={{"--top": transition}} onToggle={e => toggle(e, 1)} onClick={e => setTransition("1s linear")}>
      <summary>Builds trust and credibility</summary>
      <div className={`detText`}>A well built website makes your business also appear well built.  (I can't help you make sure your business actually is well built, but I can certainly make sure your website will be!)</div>
    </details>
    <details name="why" className="bubble" ref={T02} style={{"--top": transition}} onToggle={e => toggle(e, 2)} onClick={e => setTransition("1s linear")}>
      <summary>You can be open 24/7</summary>
      <div className={`detText`}>Do you really want to answer the phone at 9pm on a Saturday?  Providing detailed information on your site lets your customers get the information they need, whenever they need it.
      <br/><br/>Whether your customers are at work, on the train, or on the toilet, your site doesn't judge.</div>
    </details>
    <details name="why" className="bubble" ref={T03} style={{"--top": transition}} onToggle={e => toggle(e, 3)} onClick={e => setTransition("1s linear")}>
      <summary>Greater sales potential</summary>
      <div className={`detText`}>Additional to the above, I can hook up an online store or link to your calendar so that customers can buy your products or schedule an appointment at any time of day or night.</div>
    </details>
    <details name="why" className="bubble" ref={T04} style={{"--top": transition}} onToggle={e => toggle(e, 4)} onClick={e => setTransition("1s linear")}>
      <summary>Improved visibility and reach</summary>
      <div className={`detText`}>Whether your service is available only for your local area, home city, or entire world, good Search Engine Optimisation (SEO) will make it easier for your customers to find you.</div>
    </details>
    <details name="why" className="bubble" ref={T05} style={{"--top": transition}} onToggle={e => toggle(e, 5)} onClick={e => setTransition("1s linear")}>
      <summary>Data Collection</summary>
      <div className={`detText`}>I know, I know, I said a bad word.  But data is valuable, and it doesn't need to mean personal data.  Gathering information on where people are finding your site, what's getting clicked on the most, and where customers leave can tell you exactly what works, and what doesn't (or it can tell me, and I can tell you)!</div>
    </details>
    <div className="bubble header2">
      <h2>Why do you need a WICKED website<br/>from Monster Basket?</h2>
      <p>How many websites have you visited that you actually remember?  I'm not talking about the website for your bank, email, or social media, but all the rest.  When you're looking to buy something specific or finding information, don't all the sites just blend together and slip from your memory as soon as you leave?  Is that what you want your customers to do with your site?  Didn't think so.
      <br/><br/>
      Here are 5 reasons why you should pay me to make your website for you.</p>
    </div>
    <details name="why" className="bubble" ref={T07} style={{"--top": transition}} onToggle={e => toggle(e, 7)} onClick={e => setTransition("1s linear")}>
      <summary>Trust and credibility</summary>
      <div className={`detText`}>Hang on, I hear what you're saying; "Isn't that the same reason you said before?" and yeah, it is, but with a twist.  People spend more time online than ever before, to most people: your website IS your business.
        <br/><br/>Whether you're selling physical products, services, or just advice, pretend your website is a physical store.  What's your impression of a store with really neat shelves and attractive displays, vs a store that's a chaotic mess?  If your website is a chaotic mess, people will leave in SECONDS (literally 10-20 seconds), and never come back.</div>
    </details>
    <details name="why" className="bubble" ref={T08} style={{"--top": transition}} onToggle={e => toggle(e, 8)} onClick={e => setTransition("1s linear")}>
      <summary>Point of interest</summary>
      <div className={`detText`}>There's a well documented phenomenon called the picture superiority effect, which means that most people remember visuals waaaay better than text.  Marketers have known this for decades, and also know that if the visuals are pleasing, relevant to their interests, emotional, or shocking, they're even more powerful.  Whatever your vibe, be it professional, casual, trippy, or downright psychedelic, I gotchu.  (I can't do cool, I'm a dad)</div>
    </details>
    <details name="why" className="bubble" ref={T09} style={{"--top": transition}} onToggle={e => toggle(e, 9)} onClick={e => setTransition("1s linear")}>
      <summary>Movement</summary>
      <div className={`detText`}>Intentionally designed animations can draw your customers' eyes where you want them to.  For instance, did you even notice the pink elephant on this page, or was your eye drawn to the info?  Close this box and look again!
      <br/><br/>You probably didn't know this was even a thing, but I have an actual degree in animation. I know this shit.</div>
    </details>
    <details name="why" className="bubble" ref={T10} style={{"--top": transition}} onToggle={e => toggle(e, 10)} onClick={e => setTransition("1s linear")}>
      <summary>Memorable</summary>
      <div className={`detText`}>Did you know that even for cheap or impulse purchases, customers often visit the site 3 times before purchasing?  The more expensive your product (or service), the higher that number goes.  Most, if not all of your customers are also looking at your competitors, and price is not the only thing they're looking for (well, some are, but I can't help that).  When they've done their research and are ready to buy, which site do you want them to remember?</div>
    </details>
    <details name="why" className="bubble" ref={T11} style={{"--top": transition}} onToggle={e => toggle(e, 11)} onClick={e => setTransition("1s linear")}>
      <summary>Time is money</summary>
      <div className={`detText`}>I know you've already thought about this, but yes, you could probably make your site yourself, but how long would it take you?  You're running a business, you have better things to do with your time, and it will take you WAY longer than it will take me.  And trust me, AI will only get you so far (and you'll have no idea what it's stuffed up until it's too late)</div>
    </details>
  </>
}