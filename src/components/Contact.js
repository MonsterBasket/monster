import { useEffect, useRef } from "react";
import Matter from "matter-js";
import "../CSS/contact.css"
import linkedIn from "../images/linkedin.png"
import blueSky from "../images/bluesky.webp"
import insta from "../images/instagram.png"

export default function Contact() {
  const canvasRef = useRef();
  const canvas = useRef();
  const img1Pos = {
    x: Math.random() * (window.innerWidth - 100),
    y: Math.random() * (window.innerHeight - 70)
  }
  const img2Pos = {
    x: Math.random() * (window.innerWidth - 100),
    y: Math.random() * (window.innerHeight - 70)
  }
  const img3Pos = {
    x: Math.random() * (window.innerWidth - 100),
    y: Math.random() * (window.innerHeight - 70)
  }

  useEffect(() => {
    canvas.current = canvasRef.current;
    const ctx = canvas.current.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    const engine = Matter.Engine.create();
    const Composite = Matter.Composite;
    const world = engine.world;
    world.gravity.scale = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const img1 = new Image();
    const img2 = new Image();
    const img3 = new Image();
    img1.src = linkedIn;
    img2.src = blueSky;
    img3.src = insta;
    checkPos(img2Pos, img1Pos)
    checkPos(img3Pos, img1Pos)
    checkPos(img3Pos, img2Pos)

    function checkPos(pos1, pos2){
      if (Math.abs(pos2.x - pos1.x) < 70 && Math.abs(pos2.y - pos1.y) < 70){
        if (pos1.y < (window.innerHeight - 200)) pos1.y += 150
        else pos1.y -= 150
      }
    }

    const Bodies = Matter.Bodies;
    // const mouseConstraint = Matter.MouseConstraint.create(engine, {
    //   element: document.body,
    // });
    // Composite.add(world, mouseConstraint);
    // Matter.Composite.add(world, mouseConstraint);

    function getCoords(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    const balls = [];
    (function setup() {
      let r = 15;
      const cat1 = 0x0001,
        cat2 = 0x0002,
        cat3 = 0x0004,
        cat4 = 0x0008;
      const l = () => mouseX + (Math.random() * 30 + 60) * (Math.random() >= 0.5 ? -1 : 1);
      const t = () => mouseY + (Math.random() * 30 + 60) * (Math.random() >= 0.5 ? -1 : 1);
      function blue(options) {
        // rgb(20,205,205)
        let rgb = [85, 205, 205];
        options.label = [
          "blue",
          rgb[0] + Math.floor(Math.random() * 5),
          rgb[1] + Math.floor(Math.random() * 30),
          rgb[2] + Math.floor(Math.random() * 30),
        ];
        return Bodies.circle(l(), t(), r / 2 + Math.random() * 2, options);
      }
      function yellow(options) {
        // rgb(205, 205, 20)
        let rgb = [205, 205, 20];
        options.label = [
          "yellow",
          rgb[0] + Math.floor(Math.random() * 30),
          rgb[1] + Math.floor(Math.random() * 30),
          rgb[2] + Math.floor(Math.random() * 5),
        ];
        return Bodies.circle(l(), t(), r / 1.5 + Math.random() * 4, options);
      }
      function red(options) {
        // rgb(205,20,20)
        let rgb = [205, 20, 20];
        options.label = [
          "red",
          rgb[0] + Math.floor(Math.random() * 30),
          rgb[1] + Math.floor(Math.random() * 5),
          rgb[2] * Math.floor(Math.random() * 5),
        ];
        return Bodies.circle(l(), t(), r + Math.random() * 6, options);
      }
      const options = {
        friction: 0.2,
        frictionAir: 0.01,
        restitution: 0.5,
        mass: 3,
        collisionFilter: { category: cat1, mask: cat1 | cat2 },
      };
      for (let i = 0; i < 200; i++) {
        options.collisionFilter =
          i % 2 === 0
            ? { category: cat1, mask: cat1 | cat2 | cat3 }
            : { category: cat1, mask: cat1 | cat2 };
        const ball =
          i < 40 ? blue(options) : i < 100 ? yellow(options) : red(options);
        balls.push(ball);
        Composite.add(world, ball);
      }
      // white
      options.label = ["white"];
      options.collisionFilter = { category: cat2, mask: cat1 | cat3 | cat4 };
      const ball = Bodies.circle(mouseX, mouseY, r, options);
      balls.push(ball);
      Composite.add(world, ball);
      options.collisionFilter = { category: cat2, mask: "" };
      const ball2 = Bodies.circle(mouseX, mouseY, 2 * r, options);
      balls.push(ball2);
      Composite.add(world, ball2);

      for (let i = 0; i < 150; i++) {
        options.collisionFilter =
          i % 2 === 0
            ? { category: cat4, mask: cat2 | cat4 }
            : { category: cat4, mask: cat2 | cat3 | cat4 };
        const ball =
          i < 40 ? blue(options) : i < 80 ? yellow(options) : red(options);
        balls.push(ball);
        Composite.add(world, ball);
      }
    })();

    function brightness(num){
      let x = (200 - Math.abs(num.x + 25 - mouseX)) / 200
      let y = (200 - Math.abs(num.y + 25 - mouseY)) / 200
      x = Math.min(Math.max(x, 0), 1);
      y = Math.min(Math.max(y, 0), 1);
      return x * y
    }

    let lastUpdate = 0;
    (function updatePos(now, lastUpdate) {
      const delta = now - lastUpdate;
      lastUpdate = now;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.filter = `brightness(${brightness(img1Pos)})`;
      drawImage(img1, img1Pos) 
      ctx.filter = `brightness(${brightness(img2Pos)})`;
      drawImage(img2, img2Pos)
      ctx.filter = `brightness(${brightness(img3Pos)})`;
      drawImage(img3, img3Pos)
      ctx.filter = "none";
      balls.forEach((b) => {
        if (b.label[0] === "white") {
          Matter.Body.setPosition(b, { x: mouseX, y: mouseY }, false);
        } else {
          let bx = (mouseX - b.position.x) * 0.000001 * delta;
          let by = (mouseY - b.position.y) * 0.000001 * delta;
          by *= bx > 0 && b.id % 2 ? 2 : 0.5;
          bx *= by < 0 && b.id % 2 ? 2 : 0.5;
          Matter.Body.applyForce(b, b.position, { x: bx, y: by });
        }
        reDraw(b);
      });
      Matter.Engine.update(engine);
      requestAnimationFrame((t) => updatePos(t, lastUpdate));
    })(0, lastUpdate);

    function reDraw(b) {
      ctx.beginPath();
      const r = b.circleRadius;
      const x = b.position.x;
      const y = b.position.y;
      const xd = ((mouseX - x) / 500) * r;
      const yd = ((mouseY - y) / 500) * r;
      let light;
      let dark;
      let color = `rgb(${b.label[1]}, ${b.label[2]}, ${b.label[3]})`;
      b.label[0] === "white"
        ? ctx.arc(x, y, r * 5, 0, 2 * Math.PI)
        : ctx.arc(x, y, r, 0, 2 * Math.PI);
      let gradient;
      let global = ctx.createRadialGradient(
        x,
        y,
        r,
        x + r / 2,
        y - r / 2,
        r / 10
      );
      global.addColorStop(0.97, "#fff0");
      global.addColorStop(1, "#fffa");
      if (b.label[0] === "white") {
        gradient = ctx.createRadialGradient(x, y, r, x, y, r * 5);
        gradient.addColorStop(0.1, "white");
        gradient.addColorStop(0.11, "#fff3");
        gradient.addColorStop(1, "#fff0");
        ctx.fillStyle = gradient;
        ctx.fill();
        return;
      }
      let shine = ctx.createRadialGradient(
        x,
        y,
        r,
        x + xd * 1.5,
        y + yd * 1.5,
        r / 10
      );
      shine.addColorStop(0.97, "transparent");
      shine.addColorStop(1, "white");
      if (b.label[0] === "red") {
        // rgb(205,20,20)
        light = `rgb(${b.label[1] + 10}, ${b.label[2] + 100}, ${b.label[3] + 100})`;
        dark = `rgb(${b.label[1] - 150}, ${b.label[2] - 20}, ${b.label[3] - 20})`;
        // gradient = "transparent" ;//hides red circles
      } else if (b.label[0] === "blue") {
        // rgb(20,205,205)
        light = `rgb(${b.label[1] + 100}, ${b.label[2] + 20}, ${b.label[3] + 20})`;
        dark = `rgb(${b.label[1] - 20}, ${b.label[2] - 150}, ${b.label[3] - 150})`;
      } else {
        //rgb(205, 205, 20)
        light = `rgb(${b.label[1] + 20}, ${b.label[2] + 20}, ${b.label[3] + 150})`;
        dark = `rgb(${b.label[1] - 150}, ${b.label[2] - 150}, ${b.label[3] - 20})`;
      }

      if (b.collisionFilter.category === 1) {
        gradient = ctx.createRadialGradient(
          x,
          y,
          r,
          x + xd * 4,
          y + yd * 4,
          r / 2
        );
        gradient.addColorStop(0, dark);
        gradient.addColorStop(0.3, color);
        gradient.addColorStop(1, light);

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.fillStyle = global;
        ctx.fill();
        ctx.fillStyle = shine;
        ctx.fill();
      } else {
        gradient = ctx.createRadialGradient(
          x,
          y,
          r,
          x - xd * 1.5,
          y - yd * 1.5,
          r
        );
        gradient.addColorStop(0, light);
        gradient.addColorStop(0.4, color);
        gradient.addColorStop(1, dark);

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.fillStyle = global;
        ctx.fill();
      }
    }

    function drawImage(img, pos){
      ctx.drawImage(img, pos.x, pos.y, 50, 50);
    }

    window.addEventListener("mousemove", getCoords, false);
    img1.addEventListener("load", () => drawImage(img1, img1Pos), false);
    img2.addEventListener("load", () => drawImage(img2, img2Pos), false);
    img3.addEventListener("load", () => drawImage(img3, img3Pos), false);

    return () => {
      window.removeEventListener("mousemove", getCoords, false);
      img1.removeEventListener("load", () => drawImage(img1, img1Pos), false);
      img2.removeEventListener("load", () => drawImage(img2, img2Pos), false);
      img3.removeEventListener("load", () => drawImage(img3, img3Pos), false);      
    }
  }, []);

  return <div id="contact">
  <canvas ref={canvasRef} />
    <a className="canLink" href="https://www.linkedin.com/company/monsterbasket/"    alt="Follow us on LinkedIn"  style={{left: `${img1Pos.x}px`, top: `${img1Pos.y}px`}}><div/></a>
    <a className="canLink" href="https://bsky.app/profile/monsterbasket.bsky.social" alt="Follow us on BlueSky"   style={{left: `${img2Pos.x}px`, top: `${img2Pos.y}px`}}><div/></a>
    <a className="canLink" href="https://www.instagram.com/monsterbasketaus/"        alt="Follow us on Instagram" style={{left: `${img3Pos.x}px`, top: `${img3Pos.y}px`}}><div/></a>
  </div>
}
