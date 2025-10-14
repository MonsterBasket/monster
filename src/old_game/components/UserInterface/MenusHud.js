import "./hud.css"

// This is the container for the buttons on the right of the screen
function MenusHud({showItems, showArmour, showSkills, showQuests}){

  return <div id="MenusHud">
    <div onClick={showItems} id="itemsBtn" className="menuItem">
      <div id="itemsBtnImg" className="menuBtnImg"></div>
      <div className="menuBtnText">Items (I)</div>
    </div>
    <div onClick={showArmour} id="armourBtn" className="menuItem">
      <div id="armourBtnImg" className="menuBtnImg"></div>
      <div className="menuBtnText">Armour (O)</div>
    </div>
    <div onClick={showSkills} id="skillsBtn" className="menuItem">
      <div id="skillsBtnImg" className="menuBtnImg"></div>
      <div className="menuBtnText">Skills (P)</div>
    </div>
    <div onClick={showQuests} id="questsBtn" className="menuItem">
      <div id="questsBtnImg" className="menuBtnImg"></div>
      <div className="menuBtnText">Quests (U)</div>
    </div>
  </div>
}

export default MenusHud;