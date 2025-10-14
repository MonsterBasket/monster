import "../UserInterface/windows.css"
import axios from "axios"
import { useEffect, useState } from "react"
import { serverUrl } from "../../../App"

function DroppedItems({ page, playerPos, items, setItems, character, refItems }) {
  const [floorItems, setFloorItems] = useState([])
  const [reprepare, setReprepare] = useState([])

  useEffect(getItems, [])

  function getItems() {
    axios.get(`${serverUrl}items`, { params: { character_id: character.id } })
      .then(res => {
        if (res.status == 200) {
          setItems(res.data.items);
          prepareItems(res.data.items);
        }
      })
  }

  useEffect(() => prepareItems(items), [refItems, reprepare])

  function prepareItems(items) {
    setFloorItems(items.filter(item => item.slot == "floor" && item.world_page == page))
  }

  return <>{floorItems.map(item => <DroppedItem key={`item${item.id}`} item={item} items={items} character={character} playerPos={playerPos} setReprepare={setReprepare} setItems={setItems} />)}</>
}


function DroppedItem({ item, items, character, playerPos, setReprepare, setItems }) {
  useEffect(playerPickup, [playerPos.x, playerPos.y])

  function playerPickup() {
    if (Math.abs(playerPos.x - item.world_pos_x) < 20 && Math.abs(playerPos.y - item.world_pos_y) < 30) {
      item.character_id = character.id;
      for (let i = 1; i < 51; i++) {
        if (!items.some(loopItem => loopItem.slot == i)) {
          item.slot = i;
          break
        }
      }
      item.world_pos_x = null;
      item.world_pos_y = null;
      axios.patch(`${serverUrl}items`, { item }, { withCredentials: true })
        .then(res => setItems(res.data.items))
      setReprepare([])
    }
  }

  return <div
    className="worldItem"
    style={{
      left: `${item.world_pos_x}px`,
      top: `${item.world_pos_y}px`,
      backgroundPosition: `${item.img_pos_x * -36}px ${item.img_pos_y * -36}px`
    }}>
  </div>
}

export default DroppedItems
