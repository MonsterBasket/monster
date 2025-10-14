import axios from "axios";
import { serverUrl } from "../../../App";

function savePosition(character, map, x, y){
  character = {
    id: character.id,
    current_health: character.current_health,
    current_mana: character.current_mana,
    map: map,
    pos_x: Math.round(x),
    pos_y: Math.round(y),
    respawn_x: character.respawn_x,
    respawn_y: character.respawn_y
  }
  axios.patch(`${serverUrl}location`, {character}, {withCredentials: true})
  // axios.post characters > position only, probably a new route and method in character controller to handle this
}

export default savePosition;