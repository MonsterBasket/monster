import "../CSS/webdesign.css"
import { useEffect, useRef, useState } from "react"
import TitleSection from "./webSubs/TitleSection.js"
import WhySection from "./webSubs/WhySection.js"
import WhatSection from "./webSubs/WhatSection.js"
import AboutSection from "./webSubs/AboutSection.js"
import ContactSection from "./webSubs/ContactSection.js"
import Spotlight from "./webSubs/Spotlight.js"

export default function WebDesign(){
  const scrollPos = useRef(["mid", "low", "right", "left", "right"])
  const scrollY = useRef(0);

  function scroll(e){
    const y = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    scrollY.current = y;
    if (y < 35)     scrollPos.current = ["mid", "low", "right", "left", "right"]
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
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation={window.innerWidth / 1905 * 10} result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          <feDropShadow dx="6" dy="4" stdDeviation="2" floodColor="#0004" />
        </filter>
        <filter id="goo2">
          <feGaussianBlur in="SourceGraphic" stdDeviation={window.innerWidth / 1905 * 10} result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="blur" in2="goo" operator="atop" />
          <feDropShadow dx="6" dy="4" stdDeviation="2" floodColor="#0004" />
        </filter>
      </defs>
    </svg>
    {/* ------------------- Title Section -------------------- */}
    <section className={`title ${scrollPos.current[0]}`}>
      <TitleSection />
    </section>
    {/* -------------------- Why Section --------------------- */}
    <section className={`why ${scrollPos.current[1]}`}>
      <WhySection scroll={scrollY.current}/>
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