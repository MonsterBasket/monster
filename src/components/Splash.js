import { useEffect, useRef } from "react";
import "../CSS/splash.css"
import dark from "../images/light monster.png"

export default function Main(){
  // get reference to canvas and save canvas offsets
  const canvasRef = useRef();
  const canvas = useRef();

  useEffect(() => {
    canvas.current = canvasRef.current;
    if (canvas.current) {
      const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      const img = new Image();
      img.src = dark;

      function PrimitiveBrush(context) {
        if (!(context instanceof CanvasRenderingContext2D)) {
            throw new Error('No 2D rendering context given!');
        }

        this.ctx = context;
        this.strokes = [];
        this.strokeIndex = 0;
        this.workingStrokes = [];
        this.lastLength = 0;
        this.isTouching = false;

        img.addEventListener("load", () => {
          // Image is loaded, now draw it
          this.ctx.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
        });
        this.ctx.canvas.width  = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
        this.ctx.lineCap = this.ctx.lineJoin = 'round';
      }

      PrimitiveBrush.prototype.start = function (event) {
        const x = event.clientX;
        const y = event.clientY;
        this.workingStrokes = [{
            x: x,
            y: y,
            s: 1
        }];

        this.strokes.push(this.workingStrokes);
        this.lastLength = 1;
        this.isTouching = true;
        if (this.strokes.length === 1)
          requestAnimationFrame(this._draw.bind(this));
      };

      PrimitiveBrush.prototype.move = function (event) {
        if (!this.isTouching) {
          return;
        }
        const x = event.clientX;
        const y = event.clientY;
        this.workingStrokes.push({
          x: x,
          y: y,
          s: 1
        });
      };

      PrimitiveBrush.prototype.end = function (event, foo) {
        this.move(event);
        this.isTouching = false;
      };

      PrimitiveBrush.prototype._draw = function () {
        // save the current length quickly (it's dynamic)
        // return if there's no work to do
        if (this.strokes.length === 0) {
            return;
        }
        this.ctx.globalCompositeOperation = "source-over";

        this.ctx.strokeStyle = "red"
        this.ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
        this.ctx.drawImage(img, 0, 0, canvas.current.width, canvas.current.height);
        this.ctx.globalCompositeOperation = "destination-out";

        for (let j = 0; j < this.strokes.length; j++) {
          for(let i = 1; i < this.strokes[j].length; i++){
            const f = this.strokes[j][i-1];
            const t = this.strokes[j][i]
            this.ctx.lineWidth = Math.abs(f.s);
            if (this.strokes[j][i-1].s < 0 && this.strokes[j][i-1].s >= -10){
              this.strokes[j][i-1].s += Math.max(0.1, this.strokes[j][i-1].s * -0.2)
              if (this.strokes[j][i-1].s >= -0.2) {
                this.strokes[j].shift();
                if (this.strokes[j].length === 0) {
                  this.strokes.shift()
                }
                if (this.strokes[j].length === 0) break;
              }
            }
            else{
              this.strokes[j][i-1].s += Math.max((200 - Math.abs(f.s)) * 0.01, 0.5)
            }
            this.ctx.stroke(new Path2D(`M ${f.x} ${f.y} L ${t.x} ${t.y}`));
            // this.ctx.arc(f.x, f.y, t.y, 0, Math.PI * 2);
            if (this.strokes[j][i-1].s >= 200) this.strokes[j][i-1].s -= 400;
          }
        }
        requestAnimationFrame(this._draw.bind(this))
      };

      // Set up brush to listen to events
      const brush = new PrimitiveBrush(canvas.current.getContext('2d', {alpha: true}));

      canvas.current.addEventListener('mousedown', brush.start.bind(brush));
      canvas.current.addEventListener('mousemove', brush.move.bind(brush));
      canvas.current.addEventListener('mouseup', brush.end.bind(brush));
      document.addEventListener('mousemove', e => {
        document.documentElement.style.setProperty('--x', e.clientX + 'px');
        document.documentElement.style.setProperty('--y', e.clientY + 'px');
      })
    }
  }, []);

  return (
  <div id="bg">
    <canvas ref={canvasRef} id="drawing"></canvas>
    <div className="dark"></div>
    <div className="cursor"></div>
  </div>
  );
}