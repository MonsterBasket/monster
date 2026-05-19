import Menu from "./monsterSubs/Menu.js"
import "../CSS/webdesign.css"
import Wave from "./webSubs/Wave.js"
import { useEffect, useRef } from "react"
import TitleSection from "./webSubs/TitleSection.js"
import WhySection from "./webSubs/WhySection.js"
import WhatSection from "./webSubs/WhatSection.js"
import AboutSection from "./webSubs/AboutSection.js"
import ContactSection from "./webSubs/ContactSection.js"

export default function WebDesign(){
  const scrollPos = useRef(["mid", "low", "right", "left", "right"])


  function scroll(e){
    const y = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    if (y < 30)      scrollPos.current = ["mid", "low", "right", "left", "right"]
    else if (y < 60) scrollPos.current = ["up", "mid", "right", "left", "right"]
    else if (y < 90) scrollPos.current = ["up", "left", "mid", "left", "right"]
    else             scrollPos.current = ["up", "left", "mid", "mid", "mid"]
  }

  useEffect(() =>{
    window.addEventListener('scroll', scroll) 
    return () => {
      window.removeEventListener('scroll', scroll) 
    }
  })

  return <div id="WebDesign">
    <Menu />
    <Wave />
    {/* ------------------- Title Section -------------------- */}
    <section className={`title ${scrollPos.current[0]}`}>
      <TitleSection />
    </section>
    {/* -------------------- Why Section --------------------- */}
    <section className={`why ${scrollPos.current[1]}`}>
      <WhySection />
    </section>
    {/* -------------------- What Section -------------------- */}
    <section className={`whatYouGet ${scrollPos.current[2]}`}>
      <WhatSection />
    </section>
    {/* -------- About and Contact are shown together -------- */}
    <section className={`about ${scrollPos.current[3]}`}>
      <AboutSection />
    </section>
    <section className={`contact ${scrollPos.current[4]}`}>
      <ContactSection />
    </section>
  </div>
}