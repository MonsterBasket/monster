export default function CTA({text, a}){
  return <a className="cta" href={a} target="_blank" rel="noreferrer">
    {text}
  </a>
}