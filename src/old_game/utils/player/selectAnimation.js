function selectAnimation(pos, velocity, lastDirection){
  const obj = {
    transform: `translate(${pos[0]}px, ${pos[1]}px) scale(3)`, // this is actually character position; animation and position need to be set together as they're an inline style
    animationDuration: "0.7s",
    animationTimingFunction: "steps(5, end)"
  }
  if(Math.abs(velocity[0]) > Math.abs(velocity[1]) || 
    (Math.abs(velocity[0]) > Math.abs(velocity[1] * 0.5) && (lastDirection === "KeyA" || lastDirection === "KeyD"))){
   obj.animationName = velocity[0] > 0 ? "walkRight" : "walkLeft";
  }
  else if(Math.abs(velocity[0]) < Math.abs(velocity[1]) || 
         (Math.abs(velocity[0] * 0.5)< Math.abs(velocity[1]) && (lastDirection === "KeyW" || lastDirection === "KeyS"))){
    obj.animationName = velocity[1] > 0 ? "walkDown" : "walkUp";
  }
  else if(Math.abs(velocity[0]) === Math.abs(velocity[1])){
    obj.animationName = velocity[0] > 0 ? "walkRight" : "walkLeft";
  }

  if(velocity[0] === 0 && velocity[1] === 0){
    if(lastDirection.slice(-1) === "W") obj.animationName = "idleUp";
    else if(lastDirection.slice(-1) === "S") obj.animationName = "idleDown";
    else if(lastDirection.slice(-1) === "A") obj.animationName = "idleLeft";
    else if(lastDirection.slice(-1) === "D") obj.animationName = "idleRight";
  }
  let attack = ""
  if(lastDirection.substring(0, 5) === "Space"){
    obj.animationTimingFunction = "steps(3, end)"
    obj.animationDuration = "0.3s"
    obj.animationName = "attack" + obj.animationName.substring(4)
    attack = obj.animationName
    // if(lastDirection.substring(6) === "KeyW") obj.animationName = "attackUp";
    // else if(lastDirection.substring(6) === "KeyS") obj.animationName = "attackDown";
    // else if(lastDirection.substring(6) === "KeyA") obj.animationName = "attackLeft";
    // else if(lastDirection.substring(6) === "KeyD") obj.animationName = "attackRight";
  }
    return [obj, attack]
}

export default selectAnimation;