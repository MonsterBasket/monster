import SkillSlot from "./slots/SkillSlot"

function displaySkills(){
  const items = [] //will need to fetch and save this to state
  for (let i = 0; i < 50; i++) {
    items[i] = <SkillSlot /> //this is clearly wrong, but you get the idea
  }
}

function Skills(){

  return <div id="skills">
    <h2>Skills</h2>
      <div id="skillSlots"> {/* css grid, 5 rows of 10 */}
        {displaySkills()}
      </div>
    </div>
}

export default Skills;