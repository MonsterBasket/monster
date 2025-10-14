function SkyTiler({coords, shift=[0,0]}){
  const mapCoords3 = coords[2];
  const mapCoords4 = coords[3];

  function childStyle(x, y) {
    return { backgroundPosition: `${x * -16}px ${y * -16}px`}
  }
  const mapGrid = { //this will need to be passed in if I ever want different map sizes
    gridTemplateColumns: `repeat(40, 48px)`,
    gridTemplateRows: `repeat(23, 48px)`,
    left: `${shift[0]}px`,
    top: `${shift[1]}px`
  }

  return <div className="mapGrid highZ" style={mapGrid}>
  {mapCoords3.map((item, index) => mapCoords3[index] == 0 ? <div key={`2ndLayer${index}`} className="childStyle">
    {mapCoords4[index] == 0 ? "" : <div className="secondChildStyle" style={childStyle(mapCoords4[index][0], mapCoords4[index][1])}></div>}
  </div> 
  : <div key={`2ndLayer${index}`} className="childStyle" style={childStyle(mapCoords3[index][0], mapCoords3[index][1])}>
    {mapCoords4[index] == 0 ? "" : <div className="secondChildStyle" style={childStyle(mapCoords4[index][0], mapCoords4[index][1])}></div>}
  </div>)}
</div>

}

export default SkyTiler