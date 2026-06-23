export default function LightSwitch({lights, setLights}){

  return <div className="lightSwitch" onClick={_ => setLights(!lights)}>
    <div></div>
  </div>
}