import { useEffect, useRef, useState } from "react";
import handleInput from "../../utils/player/handleInput";
import selectAnimation from "../../utils/player/selectAnimation";

function Walker({ id, attack, health, attackPos, playerPos, type, currentMap, dropItem, posInit, retEnemyPos, patrol, randomPath = false }) {
  const target = useRef(posInit);
  const currentHealth = useRef(health)
  const [x, setX] = useState(posInit[0]);
  const [y, setY] = useState(posInit[1]);
  const lastDirection = useRef("KeyS")
  const pathCounter = useRef(0);
  const myKeys = useRef([]);
  const lastRender = useRef(0);
  const maxSpeed = useRef(4)
  const velocity = useRef([0, 0]);
  const stagger = useRef(false);
  const invincible = useRef(false);
  const agro = useRef(false);
  const dead = useRef(false);
  const cancelTimer = useRef("");

  useEffect(() => {
    requestAnimationFrame((now) => { if (!dead.current) gameLoop(now, maxSpeed.current) });
  })
  useEffect(() => {
    if (pathCounter.current == 0) makePath()
  }, [])

  function gameLoop(now, maxSpeed) {
    now *= 0.01;
    const deltaTime = now - lastRender.current;
    lastRender.current = now;
    if (deltaTime) {
      let healthObj = { current_health: currentHealth.current } // this is to expose health in handleInput in the same format as character.health
      let tempHealth = currentHealth.current
      velocity.current = handleInput(currentMap, myKeys.current, velocity.current, x, y, maxSpeed, null, { a: attackPos }, healthObj);
      if ((x != target.current[0] || y != target.current[1]) && !stagger.current) walk()
      if (velocity.current[0] || velocity.current[1] && !stagger.current) {
        if (velocity.current[0]) setX(prev => prev + velocity.current[0] * deltaTime);
        if (velocity.current[1]) setY(prev => prev + velocity.current[1] * deltaTime);
      }
      retEnemyPos(id, [x + velocity.current[0], y + velocity.current[1], attack])
      if (healthObj.current_health != tempHealth) manageHealth(healthObj.current_health)
      lookForCharacter(velocity.current)
    }
  }

  function manageHealth(damage) {
    myKeys.current = {}
    if (!invincible.current) {
      currentHealth.current = damage;
      if (currentHealth.current <= 0) return death()
      invincible.current = true;
      setTimeout(() => { invincible.current = false }, 250)
    }
    if (!stagger.current) {
      stagger.current = true;
      setTimeout(() => { stagger.current = false }, 1500);
      agro.current = true;
      maxSpeed.current = 12;
    }
  }

  function death() {
    dropItem(x, y)
    setX(posInit[0])
    setY(posInit[1])
    currentHealth.current = health
    target.current = posInit
    lastDirection.current = "KeyS"
    pathCounter.current = 0
    maxSpeed.current = 4
    velocity.current = [0, 0]
    agro.current = false
    dead.current = true
    retEnemyPos(id, 0)
    clearTimeout(cancelTimer.current)
    setTimeout(() => {
      dead.current = false
      makePath()
    }, 15000)
  }

  function lookForCharacter(velocity) {
    if (velocity[0] || velocity[1]) {
      if ((velocity[0] > 0 && playerPos[0] - x > -20 && playerPos[0] - x < 200 && Math.abs(playerPos[1] - y) < 150) ||
        (velocity[0] < 0 && x - playerPos[0] > -20 && x - playerPos[0] < 200 && Math.abs(playerPos[1] - y) < 150) ||
        (velocity[1] > 0 && playerPos[1] - y > -20 && playerPos[1] - y < 200 && Math.abs(playerPos[0] - x) < 150) ||
        (velocity[1] > 0 && y - playerPos[1] > -20 && y - playerPos[1] < 200 && Math.abs(playerPos[0] - x) < 150)) getAgro();
    }
    else {
      if ((lastDirection.current === "KeyD" && playerPos[0] - x > -20 && playerPos[0] - x < 200 && Math.abs(playerPos[1] - y) < 150) ||
        (lastDirection.current === "KeyA" && x - playerPos[0] > -20 && x - playerPos[0] < 200 && Math.abs(playerPos[1] - y) < 150) ||
        (lastDirection.current === "KeyS" && playerPos[1] - y > -20 && playerPos[1] - y < 200 && Math.abs(playerPos[0] - x) < 150) ||
        (lastDirection.current === "KeyW" && y - playerPos[1] > -20 && y - playerPos[1] < 200 && Math.abs(playerPos[0] - x) < 150)) getAgro();
    }
    if (agro.current) {
      if (Math.abs(playerPos[0] - x) > 350 || Math.abs(playerPos[1] - y) > 350) {
        agro.current = false;
        maxSpeed.current = 4;
      }
      else {
        target.current = playerPos;
        maxSpeed.current = 12;
      }
    }
  }

  function getAgro() {
    setTimeout(agro.current = true, 250)
  }

  function randomTarget() {
    const targetX = Math.random() * (patrol[1][0] - patrol[0][0]) + patrol[0][0]
    const targetY = Math.random() * (patrol[1][1] - patrol[0][1]) + patrol[0][1]
    return [targetX, targetY]
  }

  function makePath() {
    let nextPathTime = Math.random() * (10000 - 5000) + 5000 //5-10 seconds
    if (randomPath) {
      target.current = randomTarget()
      clearTimeout(cancelTimer.current)
      cancelTimer.current = setTimeout(makePath, nextPathTime)
    }
    else {
      target.current = patrol[pathCounter.current]
      pathCounter.current++;
      if (pathCounter.current >= patrol.length) pathCounter.current = 0;
      if (target.current[2]) nextPathTime = target.current[2] * 1000
      clearTimeout(cancelTimer.current)
      cancelTimer.current = setTimeout(makePath, nextPathTime)
    }
  }

  function walk() { //simulates keyboard input to walk to targets
    if (stagger.current || dead.current) return
    let horizontal = target.current[0] - x
    let vertical = target.current[1] - y
    if (horizontal < -maxSpeed.current * 2) { //using maxSpeed so that they don't overshoot the mark whether they're walking or running.
      myKeys.current["KeyA"] = true;
    }
    else if (myKeys.current["KeyA"] == true) {
      myKeys.current["KeyA"] = false;
      lastDirection.current = "KeyA"
    }
    if (horizontal > maxSpeed.current * 2) {
      myKeys.current["KeyD"] = true;
    }
    else if (myKeys.current["KeyD"] == true) {
      myKeys.current["KeyD"] = false;
      lastDirection.current = "KeyD"
    }
    if (vertical < -maxSpeed.current * 2) {
      myKeys.current["KeyW"] = true;
    }
    else if (myKeys.current["KeyW"] == true) {
      myKeys.current["KeyW"] = false;
      lastDirection.current = "KeyW"
    }
    if (vertical > maxSpeed.current * 2) {
      myKeys.current["KeyS"] = true;
    }
    else if (myKeys.current["KeyS"] == true) {
      myKeys.current["KeyS"] = false;
      lastDirection.current = "KeyS"
    }
  }

  const [style, attackDirection] = selectAnimation([x, y], velocity.current, lastDirection.current);
  const mobHealth = currentHealth.current <= 0 ? 0 : currentHealth.current === health ? 0 : (currentHealth.current / health) * 100

  return <>{!dead.current ? <div className={`${type} character`} style={style}><div className="mobHealth" style={{ width: `${mobHealth}%` }}></div></div> : ""}</>
}

export default Walker;