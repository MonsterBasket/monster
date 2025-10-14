import "../CSS/cube.css"

export default function Cubes(){
  return <div className="cubeBody">
    <div className="cubeParent">
      <div className="cubeGrid">
        <div></div><div></div><div></div>
        <div></div><div></div><div></div>
        <div></div><div></div><div></div>
      </div>
      <div className="cube">
        <div className="cube1"></div>
        <div className="cube2"></div>
        <div className="cube3"></div>
        <div className="cube4"></div>
        <div className="cube5"></div>
        <div className="cube6"></div>
      </div>
    </div>
  </div>
}