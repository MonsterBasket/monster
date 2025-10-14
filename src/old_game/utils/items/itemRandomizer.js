import axios from "axios";
import { serverUrl } from "../../App";

const options = [
  {name: "Generic Item",          img_pos_x: 0,  img_pos_y: 10, item_type: "generic"},
  {name: "Gold",                  img_pos_x: 10, img_pos_y: 7,  item_type: "gold", value: 1, quantity: 100},
  {name: "Viking Helmet",         img_pos_x: 11, img_pos_y: 11, item_type: "head"},
  {name: "Flaming Sword",         img_pos_x: 2,  img_pos_y: 21, item_type: "weapon"},
  {name: "Cookie",                img_pos_x: 12, img_pos_y: 7,  item_type: "food", quantity: 1},
  {name: "Small Healing Potion",  img_pos_x: 5,  img_pos_y: 14, item_type: "food"},
  {name: "Medium Healing Potion", img_pos_x: 13, img_pos_y: 14, item_type: "food"},
  {name: "Large Healing Potion",  img_pos_x: 5,  img_pos_y: 15, item_type: "food"},
  {name: "Diamond",               img_pos_x: 7,  img_pos_y: 9,  item_type: "Quest"},
  {name: "Emerald",               img_pos_x: 5,  img_pos_y: 9,  item_type: "generic"},
  {name: "The hat of Shiny",      img_pos_x: 1,  img_pos_y: 11, item_type: "head"},
  {name: "Almost a whole shirt",  img_pos_x: 1,  img_pos_y: 0,  item_type: "body"},
  {name: "Apple",                 img_pos_x: 3,  img_pos_y: 9,  item_type: "food"}]

  //quick and dirty randomizer, but it works
function itemRandomizer(character, map, x, y, setItems, refreshItems){
  let item = options[Math.round(Math.random() * options.length)]
  item.character_id = character.id;
  item.world_page = map;
  item.world_pos_x = x;
  item.world_pos_y = y;
  item.slot = "floor";
  axios.post(`${serverUrl}items`, {item}, {withCredentials: true})
  .then((res) => {
    setItems(items => [...items, res.data.item])
    refreshItems([])
  })
}

export default itemRandomizer