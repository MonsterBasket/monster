import { useEffect, useRef, useState } from 'react';
import './underneath.css'

export default function Underneath({mX,mY}){
  // get reference to canvas and save canvas offsets
  const canvas = useRef()
  const body = useRef()
  const cursorStyle = useRef({})

  useEffect(()=>{
    if (body.current){
      const bodyRect = body.current.getBoundingClientRect()
      const x = mX - bodyRect.left - 15
      const y = mY - bodyRect.top - 15
      cursorStyle.current = {transform: `translate(${x}px, ${y}px)`}
    }
  },[mX,mY])

  useEffect(() => {
    if (canvas.current){
      const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

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

          // init context
        this.ctx.canvas.width  = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.ctx.font = "900 10vw Arial";
        this.ctx.fillStyle = "black";
        this.ctx.strokeStyle = "grey";
        this.ctx.fillText("Underneath It All",10, canvas.height * 0.93);

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
          if (this.strokes.length == 1)
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
          if (this.strokes.length == 0) {
              return;
          }
          this.ctx.fillStyle = "white";
          this.ctx.fillRect(0, 0, canvas.width, canvas.height);
          this.ctx.fillStyle = "black";
          this.ctx.fillText("Underneath It All",10, canvas.height * 0.93);
          this.ctx.strokeStyle = "grey"

          for (let j = 0; j < this.strokes.length; j++) {
            // this.ctx.beginPath();
            for(let i = 1; i < this.strokes[j].length; i++){
              const f = this.strokes[j][i-1];
              const t = this.strokes[j][i]
              // this.ctx.moveTo(f.x, f.y);
              // this.ctx.stroke();
              // this.ctx.lineTo(t.x, t.y);
              this.ctx.lineWidth = Math.abs(f.s);
              if (this.strokes[j][i-1].s < 0 && this.strokes[j][i-1].s >= -10){
                this.strokes[j][i-1].s += Math.max(0.1, this.strokes[j][i-1].s * -0.2)
                if (this.strokes[j][i-1].s >= -0.2) {
                  this.strokes[j].shift();
                  if (this.strokes[j].length == 0) {
                    this.strokes.shift()
                  }
                  if (this.strokes[j].length == 0) break;
                }
              }
              else{
                this.strokes[j][i-1].s += Math.max((200 - Math.abs(f.s)) * 0.01, 0.5)
              }
              this.ctx.stroke(new Path2D(`M ${f.x} ${f.y} L ${t.x} ${t.y}`));
              if (this.strokes[j][i-1].s >= 200) this.strokes[j][i-1].s -= 400;
            }
          }
          requestAnimationFrame(this._draw.bind(this))
      };

      // Set up brush to listen to events
      const brush = new PrimitiveBrush(canvas.current.getContext('2d', {alpha: false}));
      const canvasNode = canvas.current;

      canvasNode.addEventListener('mousedown', brush.start.bind(brush));
      canvasNode.addEventListener('mousemove', brush.move.bind(brush));
      canvasNode.addEventListener('mouseup', brush.end.bind(brush));
      return () => {
        canvasNode.removeEventListener('mousedown', brush.start.bind(brush));
        canvasNode.removeEventListener('mousemove', brush.move.bind(brush));
        canvasNode.removeEventListener('mouseup', brush.end.bind(brush));
      }
    }
  },[])


  return <div ref={body} className="pen UNbody">
    <div className="UNbg">
      <div className="UNt1">We Are All</div>
      <div className="UNt2">A Little Bit</div>
      <div className="UNdot"></div>
      <div className="UNdash"></div>
      <div className="UNcross"></div>
      <div className="UNm">M</div>
      <div className="UNa">A</div>
      <div className="UNd">D</div>
      <canvas ref={canvas} className="UNdrawing"></canvas>
      <div className="UNcursor" style={cursorStyle.current}></div>
    </div>  
  </div>
}
