import { useEffect, useState } from 'react';
import '../Game/map.css';
import './mapMaker.css';
import colliderImage from '../../images/colliders.png';
import maps from "../../utils/map/maps"


function MapMaker(){
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [previewX, setPreviewX] = useState(72);
  const [previewY, setPreviewY] = useState(89);
  const [layer, setLayer] = useState(1);
  const [nada, refresh] = useState([]);
  const [deleteTile, setDeleteTile] = useState(false);
  const [addCollider, setAddCollider] = useState(false);
  const [showOpacity, setShowOpacity] = useState(false);
  const [colliderValue, setColliderValue] = useState([["■"],[1,1]]);
  const mapSize = [40,23]
  let zed = false;

  useEffect(() => {
    window.addEventListener("keydown", handleInput);
    window.addEventListener("keyup", (e) => {if(e.key === "z") zed = false;})
    return () => {window.removeEventListener("keydown", handleInput);};
  }, [])

  function handleInput(e){
    if(e.key === "ArrowRight")           return setX(prev=>prev - 48);
    if(e.key === "ArrowLeft")            return setX(prev=>prev + 48);
    if(e.key === "ArrowUp")              return setY(prev=>prev + 48);
    if(e.key === "ArrowDown")            return setY(prev=>prev - 48);
    if(e.key === "w" && previewY >= 0)   return setPreviewY(prev=>prev - 1);
    if(e.key === "s" && previewY <= 209) return setPreviewY(prev=>prev + 1);
    if(e.key === "a" && previewX >=0)    return setPreviewX(prev=>prev - 1);
    if(e.key === "d" && previewX <= 119) return setPreviewX(prev=>prev + 1);
    if(e.key === "q"){
      setDeleteTile(prev=>!prev);
      setAddCollider(false);
    }
    if(e.key === "e"){
      setAddCollider(prev=>!prev);
      setDeleteTile(false);
    }
    if(e.key === "z") zed = true;
    if(!zed){
      if(e.code === "Numpad1") return setColliderValue([["◣"],[0,2]]);
      if(e.code === "Numpad2") return setColliderValue([["⬓"],[1,2]]);
      if(e.code === "Numpad3") return setColliderValue([["◢"],[2,2]]);
      if(e.code === "Numpad4") return setColliderValue([["◧"],[0,1]]);
      if(e.code === "Numpad5") return setColliderValue([["■"],[1,1]]);
      if(e.code === "Numpad6") return setColliderValue([["◨"],[2,1]]);
      if(e.code === "Numpad7") return setColliderValue([["◤"],[0,0]]);
      if(e.code === "Numpad8") return setColliderValue([["⬒"],[1,0]]);
      if(e.code === "Numpad9") return setColliderValue([["◥"],[2,0]]);
      if(e.code === "NumpadDecimal") return setColliderValue([["•"],[1,3]]);      
    }
    else{ //shift held down
      // if(e.code === "Numpad1") return setColliderValue([[""],[]]);
      if(e.code === "Numpad2") return setColliderValue([["▼"],[3,2]]);
      // if(e.code === "Numpad3") return setColliderValue([[""],[]]);
      if(e.code === "Numpad4") return setColliderValue([["◄"],[0,3]]);
      if(e.code === "Numpad5") return setColliderValue([["╬"],[3,1]]);
      if(e.code === "Numpad6") return setColliderValue([["►"],[2,3]]);
      // if(e.code === "Numpad7") return setColliderValue([[""],[]]);
      if(e.code === "Numpad8") return setColliderValue([["▲"],[3,0]]);
      // if(e.code === "Numpad9") return setColliderValue([[""],[]]);
      // if(e.code === "Numpad0") return setColliderValue([[""],0]);
    }
    if(e.code === "Numpad0") return setColliderValue([["X"],0]); //whether shift is held or not

    if(e.key === "1") {
      setLayer(1);
      setAddCollider(false);
    }
    if(e.key === "2"){
      setLayer(2);
      setAddCollider(false);
    }
    if(e.key === "3"){
      setLayer(3);
      setAddCollider(false);
    }
    if(e.key === "4"){
      setLayer(4);
      setAddCollider(false);
    }

    if(e.key === "`") setShowOpacity(prev => !prev)
  }

  const worldMover = {
    left: `${x}px`,
    top: `${y}px`
  }
  const mapGrid = {
    gridTemplateColumns: `repeat(${mapSize[0]}, 48px)`,
    gridTemplateRows: `repeat(${mapSize[1]}, 48px)`
  }
  const mapMakerPreview = {
    backgroundPosition: `${(previewX - 2) * -16}px ${(previewY - 2) * -16}px`
  }
  function childStyle(x, y) {
    return { backgroundPosition: `${x * -16}px ${y * -16}px`}
  }
  function colliderStyle(x, y) {
    return {
      position: "absolute",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      opacity: addCollider ? "0.5" : "0",
      backgroundImage: `url(${colliderImage})`,
      backgroundPosition: `${x * -16}px ${y * -16}px`
    }
  }
  const deleteTileStyle = {
    display: "inline-block",
    margin: "0px",
    width: "45%",
    height: "20px",
    background: `${deleteTile ? "red" : addCollider ? "white" : "green"}`
  }
  const addColliderStyle = {
    display: "inline-block",
    margin: "0px",
    width: "45%",
    height: "20px",
    background: `${addCollider ? "green" : ""}`
}

  function changeTile(index){
    if(addCollider){
      const newColliders = colliders;
      newColliders[index] = colliderValue[1];
      setColliders(newColliders)
    }
    else{
      const newArray = (layer === 1) ? coords : (layer === 2) ? coords2 : (layer === 3) ?  coords3 : coords4;
      newArray[index] = deleteTile ? 0 : [previewX, previewY];
      if(layer === 1) setCoords(newArray);
      else if(layer === 2) setCoords2(newArray);
      else if(layer === 3) setCoords3(newArray);
      else if(layer === 4) setCoords4(newArray);
    }
    refresh([]);
  }

  function changeX(e){
    setPreviewX(e.target.valueAsNumber);
  }
  function changeY(e){
    setPreviewY(e.target.valueAsNumber)
  }

  function copyCoords(){
    navigator.clipboard.writeText(`    case "XXXX":\n      map = [\n        ${JSON.stringify(coords)},\n        ${JSON.stringify(coords2)},\n        ${JSON.stringify(coords3)},\n        ${JSON.stringify(coords4)},\n        ${JSON.stringify(colliders)}\n      ]\n    break;\n`)
  }
  const map = maps("TEST")
  const mapCoords = map[0];
  const mapCoords2 = map[1];
  const mapCoords3 = map[2];
  const mapCoords4 = map[3];
  const mapColliders = map[4];
  const [coords, setCoords] = useState(mapCoords)
  const [coords2, setCoords2] = useState(mapCoords2)
  const [coords3, setCoords3] = useState(mapCoords3)
  const [coords4, setCoords4] = useState(mapCoords4)
  const [colliders, setColliders] = useState(mapColliders)


  return <div className="world" style={worldMover}>
    <div className="mapGrid" style={mapGrid}>
      {coords.map((item, index) => <div key={index} className={`childStyle${!showOpacity ? "" : layer === 1 ? " highlight" : " transparent"}`} style={childStyle(item[0], item[1])} onClick={() => changeTile(index)}>
        {coords2[index] === 0 ? "" : <div className={`secondChildStyle${!showOpacity ? "" : layer === 2 ? " highlight" : " transparent"}`} style={childStyle(coords2[index][0], coords2[index][1])}></div>}
        {coords3[index] === 0 ? "" : <div className={`secondChildStyle${!showOpacity ? "" : layer === 3 ? " highlight" : " transparent"}`} style={childStyle(coords3[index][0], coords3[index][1])}></div>}
        {coords4[index] === 0 ? "" : <div className={`secondChildStyle${!showOpacity ? "" : layer === 4 ? " highlight" : " transparent"}`} style={childStyle(coords4[index][0], coords4[index][1])}></div>}
        {colliders[index] === 0 ? "" : <div style={colliderStyle(colliders[index][0], colliders[index][1])}></div>}
      </div>)}
    </div>
    <div className="mapMaker">
      <div className="mapMakerContainer">
        <div className="mapMakerPreview" style={mapMakerPreview}>
          <div className="mapMakerBorder"></div>
        </div>
      </div>
      <input type="number" value={previewX} min="0" max="119" onChange={changeX} style={{width: "100px"}}/>
      <input type="number" value={previewY} min="0" max="209" onChange={changeY} style={{width: "100px"}}/>
      <button style={{width: "100%", height: "20px", overflow: "hidden"}} onClick={copyCoords}>Copy Coords</button>
      <div style={deleteTileStyle}>{`Layer ${layer}`}</div>
      <div style={addColliderStyle}>{`Collider ${colliderValue[0]}`}</div>
    </div>
  </div>
}

export default MapMaker;