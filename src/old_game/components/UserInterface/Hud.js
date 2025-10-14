import "./hud.css"
import "./windows.css"
import HealthHud from "./HealthHud"
import MenusHud from "./MenusHud"
import SkillsHud from "./SkillsHud"
  import Items from "./gameMenu/Items.tsx"
  import Armour from "./gameMenu/Armour.js"
  import Skills from "./gameMenu/Skills.js"
  import Quests from "./gameMenu/Quests.js"
import { useEffect, useState } from "react"
import axios from "axios"
import { serverUrl } from "../../App"
  
// master container for all the on screen buttons (HUD = Heads Up Display)
function Hud({character, items, setItems}){
  const [hideButtons, setHideButtons] = useState(false);
  const [pagePos, setPagePos] = useState(["left", "center", "right", "hidden"])
  const [transition, setTransition] = useState("")

  useEffect(getItems, [])

  function getItems(){
    axios.get(`${serverUrl}items`, {params: {character_id: character.id}})//, {withCredentials: true})
    .then(res => {
      if(res.status == 200) {
        if(res.data.items.length > 0) {
          setItems(res.data.items)
        }
        else{
          console.log("No items found")
        }
      }
      else {
        console.log(res)
      }
    })
    .catch(err => console.log("Error retrieving items:", err))
  }


  function show(option){
  setTransition("")
  if(option == "items")  setPagePos(["center", "right", "hidden", "left"])
  if(option == "armour") setPagePos(["left", "center", "right", "hidden"])
  if(option == "skills") setPagePos(["hidden", "left", "center", "right"])
  if(option == "quests") setPagePos(["right", "hidden", "left", "center"])
  setHideButtons(true)
}
function moveLeft(){
  setTransition("trans")
  setPagePos([pagePos[1], pagePos[2], pagePos[3], pagePos[0]])
}
function moveRight(){
  setTransition("trans")
  setPagePos([pagePos[3], pagePos[0], pagePos[1], pagePos[2]])
}
function close(){
  setHideButtons(false)
}
function useSkill(skill){
  console.log(skill.target.id)
}

  return <div id="hudContainer">
    <HealthHud character={character} />
    {hideButtons ? <>
      <div className={`itemsWindow ${pagePos[0]} ${transition}`}><Items items={items} /><div onClick={close}className="miniCloser">X</div></div>
      <div className={`armourWindow ${pagePos[1]} ${transition}`}><Armour items={items} /><div onClick={close}className="miniCloser">X</div></div>
      <div className={`skillsWindow ${pagePos[2]} ${transition}`}><Skills character={character} /><div onClick={close}className="miniCloser">X</div></div>
      <div className={`questsWindow ${pagePos[3]} ${transition}`}><Quests character={character} /><div onClick={close}className="miniCloser">X</div></div>
      <div onClick={close} id="closer"></div>
      <div onClick={moveLeft} className="left ontop"></div>
      <div onClick={moveRight} className="right ontop"></div>
    </> : <MenusHud showItems={_=>show("items")} showArmour={_=>show("armour")} showSkills={_=>show("skills")} showQuests={_=>show("quests")} />}
    <SkillsHud useSkill={useSkill} character={character} />
  </div>
}

export default Hud;