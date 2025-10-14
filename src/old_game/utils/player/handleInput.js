import detectColliders from "./detectColliders";

function handleInput(currentMap, myKeys, velocity, x, y, maxSpeed, attacking, enemyPos, character){

  if(attacking) return [0,0] // completely escape and stop character movement if player is attacking - if I ever implement slippery surfaces this will need to change
  let tempVelocity = velocity;
  const access = detectColliders(currentMap, x, y);

  // character collisions with enemy, enemy collisions with player attack
  if(enemyPos){
    for (const key in enemyPos) {
      if(Math.abs(enemyPos[key][0] - x) < 30 && Math.abs(enemyPos[key][1] - y) < 40){
        if(enemyPos[key][0] - x > 10) tempVelocity[0] = -20;
        if(enemyPos[key][0] - x < -10) tempVelocity[0] = 20;
        if(enemyPos[key][1] - y > 20) tempVelocity[1] = -20;
        if(enemyPos[key][1] - y < -20) tempVelocity[1] = 20;
        character.current_health -= enemyPos[key][2] ? enemyPos[key][2] : 10; // hard coding player attack until I've implemented it
      }
    }
  }
  // acceleration
  if(myKeys["KeyA"] || myKeys["KeyD"] || myKeys["KeyS"] || myKeys["KeyW"]){
    if(myKeys["KeyA"] && tempVelocity[0] > -maxSpeed && access.left)  tempVelocity[0] -= 3;
    if(myKeys["KeyD"] && tempVelocity[0] <  maxSpeed && access.right) tempVelocity[0] += 3;
    if(myKeys["KeyS"] && tempVelocity[1] <  maxSpeed && access.down)  tempVelocity[1] += 3;
    if(myKeys["KeyW"] && tempVelocity[1] > -maxSpeed && access.up)    tempVelocity[1] -= 3;
  }

  // colliders
  // diagonal hard stops
  if(Math.abs(Math.abs(tempVelocity[0]) - Math.abs(tempVelocity[1])) < 10){ // check if x and y are roughly equivalent = going diagonal
    if(tempVelocity[0] > 0 && ((tempVelocity[1] > 0 && !access.ddr) || (tempVelocity[1] < 0 && !access.dur))) tempVelocity = [0,0] // going right && ((going down && blocked) || (going up && blocked))
    if(tempVelocity[0] < 0 && ((tempVelocity[1] > 0 && !access.ddl) || (tempVelocity[1] < 0 && !access.dul))) tempVelocity = [0,0] // going left  && ((going down && blocked) || (going up && blocked))
  }

  //going right
  if(tempVelocity[0] > 0){
    if(!access.right) tempVelocity[0] = 0; //stop if hit collider directly
    else if((!access.rd && tempVelocity[1] > 0) || (!access.ru && tempVelocity[1] < 0)) tempVelocity[1] = 0; //prevent going up or down while going right if the next block doesn't allow it
    // diagonal
    if(!access.ddr && access.dur && Math.abs(tempVelocity[0]) > Math.abs(tempVelocity[1])) tempVelocity[1] = -tempVelocity[0] * 1.05; // push up if collider is diagonal
    else if(!access.dur && access.ddr && Math.abs(tempVelocity[0]) > Math.abs(tempVelocity[1])) tempVelocity[1] = tempVelocity[0] * 1.05;
  }

  //going left
  if(tempVelocity[0] < 0){
    if(!access.left) tempVelocity[0] = 0;
    else if((!access.ld && tempVelocity[1] > 0) || (!access.lu && tempVelocity[1] < 0)) tempVelocity[1] = 0;
    // diagonal
    if(!access.ddl && access.dul && Math.abs(tempVelocity[0]) > Math.abs(tempVelocity[1])) tempVelocity[1] = tempVelocity[0] * 1.05;
    else if(!access.dul && access.ddl && Math.abs(tempVelocity[0]) > Math.abs(tempVelocity[1])) tempVelocity[1] = -tempVelocity[0] * 1.05;
  }

  //going down
  if(tempVelocity[1] > 0){
    if(!access.down) tempVelocity[1] = 0;
    else if((!access.dr && tempVelocity[0] > 0) || (!access.dl && tempVelocity[0] < 0)) tempVelocity[0] = 0;
    // diagonal
    if(!access.ddr && access.ddl && Math.abs(tempVelocity[1]) > Math.abs(tempVelocity[0])) tempVelocity[0] = -tempVelocity[1] * 1.05;
    else if(!access.ddl && access.ddr && Math.abs(tempVelocity[1]) > Math.abs(tempVelocity[0])) tempVelocity[0] = tempVelocity[1] * 1.05;
  }

  //going up
  if(tempVelocity[1] < 0){
    if(!access.up) tempVelocity[1] = 0;
    else if((!access.ur && tempVelocity[0] > 0) || (!access.ul && tempVelocity[0] < 0)) tempVelocity[0] = 0;
    // diagonal
    if(!access.dul && access.dur && Math.abs(tempVelocity[1]) > Math.abs(tempVelocity[0])) tempVelocity[0] = -tempVelocity[1] * 1.05;
    else if(!access.dur && access.dul && Math.abs(tempVelocity[1]) > Math.abs(tempVelocity[0])) tempVelocity[0] = tempVelocity[1] * 1.05;
  }

  // slow collider
  if(!access.slow){ // all colliders take effect when false
    maxSpeed = maxSpeed * 0.5; // reduces maxSpeed for the rest of the script
    if(tempVelocity[0] >  maxSpeed) tempVelocity[0] = maxSpeed;
    if(tempVelocity[0] < -maxSpeed) tempVelocity[0] = -maxSpeed;
    if(tempVelocity[1] >  maxSpeed) tempVelocity[1] = maxSpeed;
    if(tempVelocity[1] < -maxSpeed) tempVelocity[1] = -maxSpeed;
  }

  // slowing and stopping - no colliders, but maxSpeed is reduced from above statement if player is on a slow collider.
  if(Math.abs(tempVelocity[0]) > 0 && !myKeys["KeyA"] && !myKeys["KeyD"]){
    if(Math.abs(tempVelocity[0]) < 2.1) tempVelocity[0] = 0; // stopping - note that 2.1 has to be higher than the 2 in slowing below
    else if(myKeys["KeyW"] || myKeys["KeyS"]){ // slow faster if changing direction
      if(tempVelocity[0] < 0) tempVelocity[0] += 3; // slowing
      if(tempVelocity[0] > 0) tempVelocity[0] -= 3;
    }
    else {
      if(tempVelocity[0] < 0) tempVelocity[0] += 2; // slowing
      if(tempVelocity[0] > 0) tempVelocity[0] -= 2;
    }
  } 
  if(Math.abs(tempVelocity[1]) > 0 && !myKeys["KeyW"] && !myKeys["KeyS"]){
    if(Math.abs(tempVelocity[1]) < 2.1) tempVelocity[1] = 0;
    else if(myKeys["KeyA"] || myKeys["KeyD"]){
      if(tempVelocity[1] < 0) tempVelocity[1] += 3;
      if(tempVelocity[1] > 0) tempVelocity[1] -= 3;
    }
    else{
      if(tempVelocity[1] < 0) tempVelocity[1] += 2;
      if(tempVelocity[1] > 0) tempVelocity[1] -= 2;
    }
  }
  return tempVelocity;
}

export default handleInput;