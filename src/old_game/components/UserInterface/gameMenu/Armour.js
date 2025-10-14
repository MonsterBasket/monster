import { useState } from "react"

function Armour({items}){
  const [armourList, setArmourList] = useState(createArmourList())

  function createArmourList(){
    const slots = ["head", "body", "legs", "feet", "hands", "weapon", "offHand", "ring1", "ring2"]
    const gear = {}
    items.map(item => { // assigns each equipped item to its relevant slot
      if(item.slot == "weapon2"){
        gear["weapon"] = item;
        gear["offHand"] = "NA"
      }
      else if(slots.indexOf(item.slot) >= 0){
        gear[item.slot] = item;
      }
    })
    slots.map(slot => { // creates divs with or without above items
      if(gear[slot]){
        gear[slot] = <div 
          key={`slot${slot}`}
          className="armourSlot withImg"
          title={gear[slot].name}
          style={{backgroundPosition: `${gear[slot].img_pos_x * -60}px ${gear[slot].img_pos_y * -60}px`}}
          >
        </div>
      }
      else gear[slot] = <div key={`slot${slot}`} className="armourSlot"></div> //empty slot
    })
    return gear;
  }

  function getStats(stat){
    // each character role will have base stats + level modifier
    // loop through armourList and summarise stats
    return 0
  }

  function getEffects(){
    // loop through armourList and summarise effects - potentially merge or refer to getStats
    return <div className="effects">+1 poison damage</div> // demo output
  }

  return <div id="armour">
    <h2>Armour</h2>
    <div id="head"    className="armourContainer"><h4>Head      </h4>{armourList["head"]}   </div>
    <div id="body"    className="armourContainer"><h4>Body      </h4>{armourList["body"]}   </div>
    <div id="legs"    className="armourContainer"><h4>Legs      </h4>{armourList["legs"]}   </div>
    <div id="feet"    className="armourContainer"><h4>Feet      </h4>{armourList["feet"]}   </div>
    <div id="hands"   className="armourContainer"><h4>Hands     </h4>{armourList["hands"]}  </div>
    <div id="weapon"  className="armourContainer"><h4>Weapon    </h4>{armourList["weapon"]} </div>
    <div id="offHand" className="armourContainer"><h4>Off-Hand  </h4>{armourList["offHand"]}</div>
    <div id="ring1"   className="armourContainer"><h4>Left Ring </h4>{armourList["ring1"]}  </div>
    <div id="ring2"   className="armourContainer"><h4>Right Ring</h4>{armourList["ring2"]}  </div>
    <div id="statContainer"><h3>Stats:</h3>
      <div id="stats">
        <div className="statsLeft">attack: </div>       <div className="statsRight">{getStats("attack")}</div>
        <div className="statsLeft">defence: </div>      <div className="statsRight">{getStats("defence")}</div>
        <div className="statsLeft">evasion: </div>      <div className="statsRight">{getStats("evasion")}</div>
        <div className="statsLeft">magic_attack: </div> <div className="statsRight">{getStats("magic_attack")}</div>
        <div className="statsLeft">magic_defence: </div><div className="statsRight">{getStats("magic_defence")}</div>
      </div>
      <h3>Effects:</h3><div id="effects">
        {getEffects()}
      </div>
    </div>
  </div>
}

export default Armour;