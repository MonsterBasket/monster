import "../windows.css"
import "../hud.css"

interface ItemsProps {
  items: any[];
}

const Items: React.FC<ItemsProps> = ({items}) => {

  function displayItems(items: any[]){
    const slots: React.ReactNode[] = [] //will need to fetch and save this to state
    for (let i = 1; i < 51; i++) {
      slots[i] = <div key={`slot${i}`} className="itemSlot"></div>
    }
    items.map(item => {
      if(!isNaN(item.slot))
      slots[+item.slot] = <div 
        key={`slot${item.slot}`}
        className="itemSlot withImg"
        title={item.name}
        style={{backgroundPosition: `${item.img_pos_x * -60}px ${item.img_pos_y * -60}px`}}
        >
        </div>
    })
    return slots
  }
    
  return <>
    <h2>Items</h2>
      <div id="itemSlots"> {/* css grid, 5 rows of 10 */}
        {displayItems(items)}
      </div>
    </>
}

export default Items;