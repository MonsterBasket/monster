function WorldTiler({coords, shift=[0,0] }){
  const mapCoords = coords[0];
  const mapCoords2 = coords[1];
  const mapColliders = coords[4];

  function childStyle(x, y) {
    return { backgroundPosition: `${x * -16}px ${y * -16}px`}
  }
  const mapGrid = { //this will need to be passed in if I ever want different map sizes
    gridTemplateColumns: `repeat(40, 48px)`,
    gridTemplateRows: `repeat(23, 48px)`,
    left: `${shift[0]}px`,
    top: `${shift[1]}px`
  }


  return <div className="mapGrid" style={mapGrid}>
      {mapCoords.map((item, index) => <div key={index} className="childStyle" style={childStyle(item[0], item[1])}>
        {mapCoords2[index] == 0 ? "" : <div className="secondChildStyle" style={childStyle(mapCoords2[index][0], mapCoords2[index][1])}></div>}
        {mapColliders[index] == 0 ? "" : <div className="collider secondChildStyle" style={childStyle(mapColliders[index][0], mapColliders[index][1])}>{index}</div>}
      </div>)}
    </div>
}

export default WorldTiler