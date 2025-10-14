import { useEffect, useRef, useState } from "react";
// import { useBeforeunload } from 'react-beforeunload';
import './map.css';
import '../../components/Characters/player.css';
import Hud from "../../components/UserInterface/Hud"
import WorldTiler from "../../components/Maps/WorldTiler";
import SkyTiler from "../../components/Maps/SkyTiler";
import Player from "../../components/Characters/Player";
import mobs from "../../utils/map/mobs";
import maps from "../../utils/map/maps";
import handleInput from "../../utils/player/handleInput";
import savePosition from "../../utils/player/savePosition";
import itemRandomizer from "../../utils/items/itemRandomizer";
import DroppedItems from "../../components/Maps/DroppedItems";

function GameController({character}){
  // character items, to be passed back and forth between character and hud
  const [items, setItems] = useState([])
  // character position - initial state is starting position
  const [x, setX] = useState(character.pos_x || 400);
  const [y, setY] = useState(character.pos_y || 400);
  // setting initial respawn pos on first play
  character.respawn_x = character.respawn_x || 400;
  character.respawn_y = character.respawn_y || 400;
  // character speed - increases incrementally and is added onto position above
  const velocity = useRef([0,0]);
  const maxSpeed = 30;
  // used for measuring the time between frames to keep a constant character movement speed regardless of frame-rate
  const lastRender = useRef(0);
  // force re-render when character stops moving, for some reason the last update of x and y reaching 0 does NOT trigger a render
  const [re, refresh] = useState([]);
  // this is used determining the direction of idle and attack animations - initial animation is "idleDown"
  const lastDirection = useRef("KeyS");
  // stops character movement while attacking and plays animation exactly once.
  const attacking = useRef(false);
  // enemy position for collision detection and health adjustment
  const enemyPos = useRef({});
  // forces DroppedItems component to refresh with new items
  const [refItems, refreshItems] = useState([])
  // prevents enemy burning all your hp in one hit
  const invincible = useRef(false)
  // player's attack position
  const attackPos = useRef([0,0,0])
  // records current keys being pressed, true on keyDown, false on keyUp
  const myKeys = useRef({});
  // this is pretty hardbaked in a lot of places, but eventually I hope to make it dynamic so I can have larger or smaller pages
  const mapSize = [40 * 48, 23 * 48]; 
  // current map screen - format: w (world) xxyy. The screen to the right is 10102, below is 10201 etc.
  const thisPage = useRef(character.map || 10101);
  // these are ALL for loading the next page and moving from one page to the next.
  const nextPage = useRef();
  const pageDirection = useRef("");
  const pageReady = useRef(false);
  const [newPageX, setNewPageX] = useState(0);
  const [newPageY, setNewPageY] = useState(0);
  const shift = useRef([0,0]);
  const turning = useRef(false);

  useEffect(() => {
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp );
    setTimeout(refreshItems([]), 500)
      return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [])

  useEffect(() => {
    requestAnimationFrame((now) => gameLoop(now, x, y, maxSpeed))
  })

  useEffect(() => {if(!turning.current) pageLoader()}, [x, y])

  function keyDown(e){
    myKeys.current[e.code] = true;
    if (!attacking.current && ["KeyA", "KeyD", "KeyS", "KeyW"].includes(e.code)) lastDirection.current = setLastDirection(e.code);
    else if(e.code === "Space" && lastDirection.current.substring(0, 5) !== "Space"){
      let keyHolder = lastDirection.current
      lastDirection.current = `Space ${lastDirection.current}`
      setTimeout(() => lastDirection.current = keyHolder, 300)
    }
  }
  function keyUp(e){
    if(e.code !== "Space") myKeys.current[e.code] = false;
  }

  function setLastDirection(code){
    if(code === "KeyW" && !myKeys.current["KeyA"] && !myKeys.current["KeyD"]) return "KeyW"
    if(code === "KeyS" && !myKeys.current["KeyA"] && !myKeys.current["KeyD"]) return "KeyS"
    if(code === "KeyA" && !myKeys.current["KeWA"] && !myKeys.current["KeyS"]) return "KeyA"
    if(code === "KeyD" && !myKeys.current["KeWA"] && !myKeys.current["KeyS"]) return "KeyD"
    return lastDirection.current;
  }

  function gameLoop(now, x, y, maxSpeed) { //runs every frame before render
    now *= 0.01;
    const deltaTime = now - lastRender.current;
    lastRender.current = now;
    if (deltaTime) { //skips evaluations if no time has passed since last call (which strangely does happen)
      if(myKeys.current["Space"] === true){
        attacking.current = true;
        setTimeout(() => {
          attacking.current = false;
          myKeys.current["Space"] = false;
        }, 300);
      }
      const tempHealth = character.current_health
      const temp = {current_health: tempHealth};
      velocity.current = handleInput(thisPage.current, myKeys.current, velocity.current, x, y, maxSpeed, attacking.current, enemyPos.current, temp);
      if(velocity.current[0]) setX(prev => prev + velocity.current[0] * deltaTime);
      if(velocity.current[1]) setY(prev => prev + velocity.current[1] * deltaTime);
      if(Math.abs(velocity.current[0]) < 0.1 && Math.abs(velocity.current[1]) < 0.1) refresh([]);
      if(character.current_health != temp.current_health) manageHealth(temp.current_health)
    }
  }

  const worldMover = { // keeps player in center of map but clamps its position so you won't see past any edge
    left: `clamp(${Math.min(window.innerWidth, 1920) - mapSize[0]}px, ${-x + Math.min(window.innerWidth, 1920) / 2}px, 0px)`,
    top: `clamp(${Math.min(window.innerHeight, 1080) - mapSize[1]}px, ${-y + Math.min(window.innerHeight, 1080) / 2}px, 0px)`
  }
  const mobileWorldMover = { // keeps player in center of map but clamps its position so you won't see past any edge
    left: `clamp(${(window.innerWidth - mapSize[0]) * 0.732}px, ${(-x + (window.innerWidth / 2)) * 0.7 + (window.innerWidth * -0.225)}px, ${(mapSize[0] * -0.126)}px)`,
    top: `clamp(${(window.innerHeight - mapSize[1]) * 0.732}px, ${(-y + (window.innerHeight / 2)) * 0.7 + (window.innerHeight * -0.225)}px, ${(mapSize[1] * -0.126)}px)`
  }
  const pageTurner = {
    left: newPageX,
    top: newPageY
  }

  // passed down to enemies who report back their positions each frame.  Character's collision detector loops through them all. - Attack is bundled in as the third array element.
  function retEnemyPos(id, pos){
    if(pos === 0) delete enemyPos.id;
    enemyPos.current[id] = pos
  }

  // creating a coordinate on the map with player attack to pass to each enemy's collision detector. Works as above but for enemies, not character.
  function playerAttack(attack){
    if(attack.substring(0, 6) === "attack"){
      if(attack.substring(6) === "Up") attackPos.current = [Math.round(x), Math.round(y) - 30, character.attack]
      if(attack.substring(6) === "Down") attackPos.current = [Math.round(x), Math.round(y) + 30, character.attack]
      if(attack.substring(6) === "Left") attackPos.current = [Math.round(x) - 20, Math.round(y), character.attack]
      if(attack.substring(6) === "Right") attackPos.current = [Math.round(x) + 20, Math.round(y), character.attack]
    }
    else attackPos.current = [0,0,0]
  }

  function manageHealth(health){
    if(invincible.current) return
    character.current_health = health
    invincible.current = true;
    setTimeout(() => invincible.current = false, 300)
    if(character.current_health <= 0) respawn(true)
  }

  function respawn(dead){
    myKeys.current = {}
    velocity.current = [0,0]
    setX(character.respawn_x)
    setY(character.respawn_y)
    if(dead){
      character.current_health = character.max_health;
      // exp -= 5% of exp required to get to next level
    }
    else { //allows respawn from falling down pits that I haven't implemented yet.
      character.current_health -= character.max_health * 0.1;
      if(character.current_health <= 0) respawn(true)
    }
  }

  function dropItem(x, y){
    itemRandomizer(character, thisPage.current, x, y, setItems, refreshItems)
  }

  // ----------------------------------------------------------------------------------------------------
  // -----------------------  PAGE LOADER AND TURNER FUNCTIONS ------------------------------------------
  // ----------------------------------------------------------------------------------------------------
  function pageLoader(){
    if(!nextPage.current){ // if next page hasn't been loaded yet, check if player is near the edge of the screen, and load that map
      if(x > mapSize[0] - 100) pageDirection.current = "right";
      else if(x < 100) pageDirection.current = "left";
      else if(y < 100) pageDirection.current = "up";
      else if(y > mapSize[1] - 100) pageDirection.current = "down";
      if(pageDirection.current) newPage(pageDirection.current) // go to function that loads page
    }
    else { // if page is loaded, check which screen edge player is at and then...
      if(pageDirection.current === "right"){ // unload the next page if player moves away from screen edge
        if(x < mapSize[0] - 100) {
          pageDirection.current = "";
          nextPage.current = "";
          pageReady.current = false;
          return
        }
        else if(pageReady.current && x >= mapSize[0]) turnPage() // or turn the page if player walks off the edge of the screen
      }
      if(pageDirection.current === "left"){
        if(x > 100) {
          pageDirection.current = "";
          nextPage.current = "";
          pageReady.current = false;
          return
        }
        else if(pageReady.current && x <= 0) return turnPage()
      }
      if(pageDirection.current === "up"){
        if(y > 100) {
          pageDirection.current = "";
          nextPage.current = "";
          pageReady.current = false;
          return
        }
        else if(pageReady.current && y <= 0) return turnPage()
      }
      if(pageDirection.current === "down"){
        if(y < mapSize[1] - 100) {
          pageDirection.current = "";
          nextPage.current = "";
          pageReady.current = false;
          return
        }
        else if(pageReady.current && y >= mapSize[1]) return turnPage()
      }
    }
  }

  function newPage(direction = "up", page = ""){ // optional page parameter allows me to load pages through other means than just walking off the edge of the screen
    // direction has a default paramater because it's needed if not passing in a predetermined page to load

    if(direction === "left"){ // determine which page to load depending on which edge of the screen the player is at
      nextPage.current = page || parseInt(thisPage.current) - 100; // pages are numbered as wxxyy coordinates (w = world, and also means low x values don't start with 0).
      shift.current = [-mapSize[0], 0] // determins where the next page is positioned when it loads
    }
    else if(direction === "right"){
      nextPage.current = page || parseInt(thisPage.current) + 100;
      shift.current = [mapSize[0], 0]
    }
    else if(direction === "up"){
      nextPage.current = page || parseInt(thisPage.current) - 1;
      shift.current = [0, -mapSize[1]]
    }
    else if(direction === "down"){
      nextPage.current = page || parseInt(thisPage.current) + 1;
      shift.current = [0, mapSize[1]]
    }
    if(maps(nextPage.current)) pageReady.current = true; // allow turning page if it exists in the maps list.  Colliders should prevent this ever being false.
  }

  function turnPage(){
    // these all determine whether to move the screens up down left or right
    let horizontal = true;
    let multiplier = 1 * 0.75;
    turning.current = true;
    if(pageDirection.current === "right") multiplier = -1 * 0.75;
    else if(pageDirection.current === "up") horizontal = false;
    else if(pageDirection.current === "down"){
      multiplier = -1;
      horizontal = false;
    }
    // move the page, 17ms x30 is 60fps for half a second.
    for (let i = 0; i < 30; i++) {
      setTimeout(_ => {
        if(horizontal) setNewPageX(prev => prev + (window.innerWidth / 30) * multiplier)
        else setNewPageY(prev => prev + (window.innerHeight / 30) * multiplier)
        if(i >= 29) return recenterPage() //reposition new and previous pages after the last frame of turning pages
      }, i*17)
    }
  }

  function recenterPage(){
    let newX = x //required for savePosition as setX and setY don't update until after it's called.
    let newY = y
    if(pageDirection.current === "left"){
      pageDirection.current = "right"; // if you were on the left and exited the screen, you're now on the right of the new screen
      setX(prev => prev + mapSize[0]); // reset character x or y coordinate onto new screen 
      newX = x + mapSize[0];
      setNewPageX(0); // set new page to default position (we're about to swap the new page to the current page after these if/else statements)
      shift.current = [mapSize[0], 0] // set old page to the left of screen in case player turns straight back around 
      }
    else if(pageDirection.current === "right"){
      pageDirection.current = "left";
      setX(prev => prev - mapSize[0]);
      newX = x - mapSize[0];
      setNewPageX(0);
      shift.current = [-mapSize[0], 0]
      }
    else if(pageDirection.current === "up"){
      pageDirection.current = "down";
      setY(prev => prev + mapSize[1]);
      newY = y + mapSize[1];
      setNewPageY(0);
      shift.current = [0, mapSize[1]]
      }
    else if(pageDirection.current === "down"){
      pageDirection.current = "up";
      setY(prev => prev - mapSize[1]);
      newY = y - mapSize[1];
      setNewPageY(0);
      shift.current = [0, -mapSize[1]]
    }
    // swap current and new pages around so that if player turns around and goes back there'll be a page for them to see
    turning.current = false
    let tempPage = thisPage.current
    thisPage.current = nextPage.current;
    nextPage.current = tempPage;
    character.respawn_x = newX;
    character.respawn_y = newY;
    savePosition(character, thisPage.current, newX, newY); //save character position to db every time you change screens.
    refreshItems([])
  }
  // ----------------------------------------------------------------------------------------------------
  // --------------------------------- END OF PAGE LOADER FUNCTIONS -------------------------------------
  // ----------------------------------------------------------------------------------------------------
  // useBeforeunload(() => savePosition(character, thisPage.current, x, y))

  return <div className="gameContainer">
    <div className="world" style={window.innerHeight < 600 ? mobileWorldMover : worldMover}>
      <div className="world2" style={pageTurner}>
        <WorldTiler coords={maps(thisPage.current)} />
        {pageReady.current ? <WorldTiler coords={maps(nextPage.current)} shift={shift.current} /> : ""}
          {pageReady.current ? mobs(nextPage.current, retEnemyPos, attackPos.current, [x, y], dropItem, shift.current) : ""}
          {mobs(thisPage.current, retEnemyPos, attackPos.current, [x, y], dropItem)}
          <DroppedItems page={thisPage.current} playerPos={{x:x, y:y}} character={character} items={items} setItems={setItems} refItems={refItems}/>
          <Player pos={[x, y]} velocity={velocity.current} lastDirection={lastDirection.current} role={character.role} playerAttack={playerAttack} items={items} setItems={setItems}/>
        <SkyTiler coords={maps(thisPage.current)} />
        {pageReady.current ? <SkyTiler coords={maps(nextPage.current)} shift={shift.current} /> : ""}
      </div>
      {/* <div style={{position: "fixed", left:"0px", top:"50px", zIndex:"3", color: "white"}}>x: {x}<br /> y: {y}</div> */}
    </div>
    <Hud character={character} items={items} setItems={setItems} />
  </div>
}

export default GameController;