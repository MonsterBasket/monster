import { useEffect, useRef } from 'react';
import Matter from "matter-js"
import "../CSS/fourOhFour.css"
import { editableInputTypes } from '@testing-library/user-event/dist/utils';

export default function FourOhFour() {
  const canvas = useRef();
  const speed = useRef(4);

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    ctx.canvas.width = 800;
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

    function getCoords(e) {
      const left = canvas.current.getBoundingClientRect().left
      let x = e.clientX - left
      if (x < 50) x = 50;
      else if (x > 750) x = 750
      mouseX = x;
      mouseY = e.clientY;
    }

    const balls = [];
    const blocks = [];
    (function createBouncer(options) {
      options.label = ["bouncer"];
      options.chamfer = {radius: 10}
      options.render.fillStyle = '#444'
      options.restitution = 1.5
      options.friction = 0.5;
      const bouncer = Bodies.rectangle(mouseX, ctx.canvas.height - 40, 100, 20, options);
      Matter.Body.setStatic(bouncer, true)
      balls.push(bouncer);
      Composite.add(world, bouncer);
      options.label = ["block"]
      let text = "ain't nothin' here!";
      const w = 800 / text.length;
      for (let i = 0; i < text.length; i++) {
        if (text[i] == " ") continue
        let temp = {...options}
        const a = "block"
        const b = text.substring(i, i+1)
        const letter = Bodies.rectangle(w * i + w / 2, 175, w-1, 80, {...temp, label: [a, i, b, 5]})
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
    (function updatePos(now, lastUpdate) {
      lastUpdate = now;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      Matter.Body.setPosition(balls[0], { x: mouseX, y: ctx.canvas.height - 40 }, false);
      Matter.Body.setAngle(balls[0], 0)
      if(engine.pairs.list.length > 0 && engine.pairs.list[0].bodyA.label[0] == "block"){
        const block = engine.pairs.list[0].bodyA
        block.label[3] -= 1
        if (block.label[3] <= 0){
          Matter.Body.setStatic(block, false)
          block.collisionFilter.mask = 0;
        } else {
          let colour = parseInt(block.render.fillStyle.substring(1))
          colour += 89
          block.render.fillStyle = `#${colour}`
        }
      }
      Matter.Pairs.clear(engine.pairs)
      Matter.Render.world(render);
      ctx.font = "400 5rem Arial"
      ctx.fillStyle = "white";
      blocks.forEach(b => {
        ctx.fillText(b.label[2], b.position.x, b.position.y + 30)
        Matter.Body.applyForce(b, b.position, {x:0, y:0.001})
      })
      ctx.font = "900 5rem Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#111";
      ctx.fillText("Whoops!", ctx.canvas.width / 2, 100);
      ctx.fillStyle = "#111";
      ctx.fillText("Go home?", ctx.canvas.width / 2, 300);
      ctx.fillText("or Portfolio?", ctx.canvas.width / 2, 400);

      let killBalls = []
      balls.forEach((b) => {
        if (b.label[0] === "bouncer") { return
        } else {
          let vx = b.velocity.x;
          let vy = b.velocity.y;
          if (b.velocity.x > 0 && b.position.x > 800 - b.circleRadius) vx *= -1
          if (b.velocity.x < 0 && b.position.x < b.circleRadius) vx *= -1
          if (b.velocity.y > 0 && b.position.y > ctx.canvas.height + b.circleRadius)
            killBalls.push(balls.indexOf(b))
          if (b.velocity.y < 0 && b.position.y < b.circleRadius) vy *= -1
          if (Math.abs(vy) < 0.1) vy += Math.sign(vy) * 0.1;
          Matter.Body.setVelocity(b, {x: vx, y: vy})
          Matter.Body.setSpeed(b, speed.current)
        }
        reDraw(b);
      });
      killBalls.sort((a, b) => b - a)
      killBalls.map(b => {
        Composite.remove(world, balls[b])
        balls.splice(b,1);
      })
      // Matter.Pairs.clear(engine.pairs)

      // Matter.Engine.update(engine);
      requestAnimationFrame((t) => updatePos(t, lastUpdate));
    })(0, lastUpdate);

    function reDraw(b) {
      if (b.label[0] === "bouncer") {
        return;
      }
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
    return () => {
      window.removeEventListener("mousemove", getCoords, false);
      window.removeEventListener("touchmove", getCoords, false);
      window.removeEventListener("touchstart", click, false);
      window.removeEventListener("mousedown", click, false);
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