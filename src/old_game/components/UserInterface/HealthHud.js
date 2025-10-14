import "./hud.css"

// health and manabar container
function HealthHud({character}){

  let health = {}
  let mana = {}
  if(character.current_health <= 0) health = 0;
  else health = (character.current_health / character.max_health) * 100;
  if(character.current_mana <= 0) mana = 0;
  else mana = (character.current_mana / character.max_mana) * 100

  return <div id="HealthHud">
    <div id="healthbarContainer"><div style={{width: `${health}%`}} id="healthbar"></div></div>
    <div id="manabarContainer"><div style={{width: `${mana}%`}} id="manabar"></div></div>
  </div>
}

export default HealthHud;