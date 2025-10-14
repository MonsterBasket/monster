import "./hud.css"

// This is the container for the skills buttons at the bottom of the screen
function SkillsHud({useSkill}){


  return <div id="SkillsHud">
    <div onClick={useSkill} id="skill1" className="skillSlot"></div>
    <div onClick={useSkill} id="skill2" className="skillSlot"></div>
    <div onClick={useSkill} id="skill3" className="skillSlot"></div>
    <div onClick={useSkill} id="skill4" className="skillSlot"></div>
    <div onClick={useSkill} id="skill5" className="skillSlot"></div>
    <div onClick={useSkill} id="skill6" className="skillSlot"></div>
    <div onClick={useSkill} id="skill7" className="skillSlot"></div>
    <div onClick={useSkill} id="skill8" className="skillSlot"></div>
  </div>
}

export default SkillsHud;