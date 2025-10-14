import selectAnimation from "../../utils/player/selectAnimation"

function Player({pos, velocity, lastDirection, role, playerAttack, items, setItems}){

  const [style, attack] = selectAnimation(pos, velocity, lastDirection);
  playerAttack(attack);

  return <div id="player" className={`character ${role}`} style={style}></div>
}

export default Player;