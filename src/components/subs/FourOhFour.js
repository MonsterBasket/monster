import { useEffect, useRef } from 'react';
import Matter from "matter-js"
import "../../CSS/fourOhFour.css"

export default function FourOhFour() {
  const canvas = useRef();
  const speed = useRef(4);

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    let sw = Math.min(800, window.innerWidth)
    ctx.canvas.width = sw;
    ctx.canvas.height = window.innerHeight;
    const engine = Matter.Engine.create();
    const Composite = Matter.Composite;
    let render = Matter.Render.create({
      canvas: canvas.current,
      engine: engine,
      options: {
        width: 800,
        height: ctx.canvas.height,
        wireframes: false,
        background: 'transparent'
      }
    })
    const colours = {c5: "#8e7d69", c4: "#9b6f5e", c3: "#9e5746", c2: "#b34b31", c1: "#a32c23", c0: "#720e06"}
    Matter.Render.run(render)
    let runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)
    const world = engine.world;
    world.gravity.scale = 0;
    const cat1 = 0x0001, cat2 = 0x0002;
    const options = {
      friction: 0,
      frictionAir: 0,
      restitution: 1.1,
      mass: 3,
      collisionFilter: { category: cat1, mask: cat1 | cat2 },
      render: render
    };
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight * 0.1;

    const Bodies = Matter.Bodies;
    let bouncer;
    const balls = [];
    const blocks = [];

    function resize() {
      sw = Math.min(800, window.innerWidth)
      ctx.canvas.width = sw;
      ctx.canvas.height = window.innerHeight;
    }

    function getCoords(e) {
      const left = canvas.current.getBoundingClientRect().left
      let x = ("clientX" in e ? e.clientX : e.touches[0].clientX) - left;
      if (x < 50) x = 50;
      else if (x > sw - 50) x = sw - 50
      mouseX = x;
      mouseY = "clientY" in e ? e.clientY : e.touches[0].clientY;
    }

    (function setup(options) {
      //bouncer
      options.label = ["bouncer"];
      options.chamfer = {radius: [15,15,5,5]}
      options.render.fillStyle = '#d8af7f'
      options.restitution = 1.5
      options.friction = 0.5;
      bouncer = Bodies.rectangle(mouseX, ctx.canvas.height - 40, 100, 20, options);
      Matter.Body.setStatic(bouncer, true)
      Composite.add(world, bouncer);
      //blocks
      options.label = ["block"]
      let text = "ain't nothin' here!";
      const w = sw / text.length;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") continue
        let temp = {...options}
        temp.chamfer = {radius: 10}
        temp.render.fillStyle = colours.c5
        temp.label = ["block", i, text.substring(i, i+1), 5]
        const letter = Bodies.rectangle(w * i + w / 2, 175, w-1, w * 2, {...temp})
        Matter.Body.setStatic(letter, true)
        blocks.push(letter)
        Composite.add(world, letter);
      }
    })(options);

    function click(){
      let r = 15;
      options.label = [
        "ball",
        225 + Math.floor(Math.random() * 30), //red
        225 + Math.floor(Math.random() * 30), //green
        225 + Math.floor(Math.random() * 30), //blue
        0.3 + Math.random() * 0.3, // iris Width
        100 + Math.floor(Math.random() * 100), //iris red
        150 + Math.floor(Math.random() * 105), //iris green
        150 + Math.floor(Math.random() * 105) //iris blue
      ];
      const ball = Bodies.circle(mouseX, ctx.canvas.height - 40 - r, r / 1.5 + Math.random() * 4, options);
      balls.push(ball);
      Composite.add(world, ball);
      Matter.Body.setVelocity(ball, {x: speed.current, y: -speed.current})
    }

    let lastUpdate = 0;
    (function mainUpdate(now, lastUpdate) {
      lastUpdate = now;
      ctx.clearRect(0, 0, sw, ctx.canvas.height);
      Matter.Body.setPosition(bouncer, { x: mouseX, y: ctx.canvas.height - 40 }, false);
      Matter.Body.setAngle(bouncer, 0)
      engine.pairs.list.forEach(l => {
        if (l.bodyA.label[0] !== "block" && l.bodyB.label[0] !== "block") return
        if (!l.bodyA.isStatic && !l.bodyB.isStatic) return
        let b = (l.bodyA.label[0] === "block" && l.bodyA.isStatic) ? l.bodyA : l.bodyB;
        if (b.label[0] === "bouncer") return
        b.label[3] -= 1
        if (b.label[3] >= 0) b.render.fillStyle = colours[`c${b.label[3]}`]
        if (b.label[3] === 0)Matter.Body.setStatic(b, false)
      })
      Matter.Pairs.clear(engine.pairs)
      Matter.Render.world(render);
      ctx.font = `400 ${sw * 0.1}px Arial`
      ctx.fillStyle = "#f5e1b9";
      blocks.forEach(b => {
        ctx.save()
        ctx.translate(b.position.x, b.position.y)
        ctx.rotate(b.angle)
        ctx.textAlign = "center"
        ctx.fillText(b.label[2], 0, sw * 0.035)
        ctx.restore()
      })
      ctx.font = `900 ${sw * 0.1}px Arial`
      ctx.textAlign = "center";
      ctx.fillStyle = "#111";
      ctx.fillText("Whoops!", sw / 2, 100);
      ctx.fillStyle = "#111";
      ctx.fillText("Go home?", sw / 2, 300);
      ctx.fillText("or Portfolio?", sw / 2, 400);

      // These allow us to loop through all physics objects before removing any from arrays or world
      let killBalls = []
      let killBlocks = []
      balls.forEach(b => {
        updatePos(b)
      });
      blocks.forEach(b => {
        if (!b.isStatic) updatePos(b)
      })
      function updatePos(b){
        let vx = b.velocity.x;
        let vy = b.velocity.y;
        if (b.velocity.x > 0 && b.bounds.max.x >= sw) vx *= -1
        if (b.velocity.x < 0 && b.bounds.min.x <= 0) vx *= -1
        if (b.velocity.y > 0 && b.bounds.min.y > ctx.canvas.height){
          if (b.label[0] === "ball")
            killBalls.push(balls.indexOf(b))
          else killBlocks.push(blocks.indexOf(b))
        }
        if (b.velocity.y < 0 && b.bounds.min.y < 0) vy *= -1
        if (Math.abs(vy) < 0.1) vy += Math.sign(vy) * 0.1;
        Matter.Body.setVelocity(b, {x: vx, y: vy})
        Matter.Body.setSpeed(b, speed.current)
        if (b.label[0] === "ball") drawBalls(b);
      }

      kill(killBalls, balls)
      kill(killBlocks, blocks)
      function kill(arr, arr2){
        if (arr.length === 0) return
        arr.sort((a, b) => b - a)
        arr.forEach(b => {
          Composite.remove(world, arr2[b])
          arr2.splice(b,1);
        })
      }
      requestAnimationFrame((t) => mainUpdate(t, lastUpdate));
    })(0, lastUpdate);

    function drawBalls(b) {
      ctx.beginPath();
      const r = b.circleRadius;
      const x = b.position.x;
      const y = b.position.y;
      const xd = ((mouseX - x) / 500) * r;
      const yd = ((mouseY - y) / 500) * r;
      let light;
      let dark;
      let color = `rgb(${b.label[1]}, ${b.label[2]}, ${b.label[3]})`;
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      let gradient;
      let global = ctx.createRadialGradient(x,y,r,  x + r / 2,  y - r / 2,  r / 10);
      global.addColorStop(0.97, "#fff0");
      global.addColorStop(1, "#fffa");
      let iris = ctx.createRadialGradient(x,y,r,  x + xd * 1.5,  y + yd * 1.5,  r / 10);
      iris.addColorStop(b.label[4], "transparent");
      iris.addColorStop(b.label[4], `rgb(${b.label[5]}, ${b.label[6]}, ${b.label[7]})`)
      iris.addColorStop(b.label[4] + 0.1, `rgb(${b.label[5]}, ${b.label[6]}, ${b.label[7]})`)
      iris.addColorStop(0.9, "black");
      light = `rgb(${b.label[1] + 30}, ${b.label[2] + 30}, ${b.label[3] + 30})`;
      dark = `rgb(${b.label[1] - 100}, ${b.label[2] - 100}, ${b.label[3] - 100})`;

      gradient = ctx.createRadialGradient(x,y,r,  x + xd * 4,  y + yd * 4,  r / 2);
      gradient.addColorStop(0, dark);
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(1, light);

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.fillStyle = global;
      ctx.fill();
      ctx.fillStyle = iris;
      ctx.fill();
    }

    window.addEventListener("mousemove", getCoords, false);
    window.addEventListener("touchmove", getCoords, false);
    window.addEventListener("touchstart", click, false);
    window.addEventListener("mousedown", click, false);
    window.addEventListener("resize", resize, false);
    return () => {
      window.removeEventListener("mousemove", getCoords, false);
      window.removeEventListener("touchmove", getCoords, false);
      window.removeEventListener("touchstart", click, false);
      window.removeEventListener("mousedown", click, false);
      window.removeEventListener("resize", resize, false);
    }
  }, []);
  

  return (
    <div id="four04">
      <canvas ref={canvas} />
      <a className="homeLink" title="return home"             alt="home" href="/"></a>
      <a className="portLink" title="go to James's portfolio" alt="portfolio" href="/portfolio"></a>
    </div>
  );
}