import Hero from "../components/Hero";

import ImpactBar from "../components/ImpactBar.jsx";
import Features from "../components/Features";
import Process from "../components/Process";
import WhyUs from "../components/WhyUs";
import BuiltForDev from "../components/BuiltForDev";
import CTA from "../components/CTA";
import LiveTestRun from "../components/LiveTestRun.jsx";
import BeforeAfterAI from "../components/BeforeAfterAI.jsx";
import Contact from "./Contact.jsx";
export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-20">
      <Hero />
      {/* <Logos /> */}
      <ImpactBar />
      <Features />
      <Process />
      <WhyUs />
      <BuiltForDev />
      <CTA />
      <BeforeAfterAI />
      <LiveTestRun />
      <Contact/>
    </div>
  );
}
