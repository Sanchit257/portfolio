import { Header } from "@/components/portfolio/Header";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Experience } from "@/components/portfolio/Experience";
import { Projects } from "@/components/portfolio/Projects";
import { Certifications } from "@/components/portfolio/Certifications";
import { Activities } from "@/components/portfolio/Activities";
import { Contact } from "@/components/portfolio/Contact";
import { StatusBar } from "@/components/portfolio/StatusBar";
import { WavesBackground } from "@/components/portfolio/WavesBackground";

export default function Home() {
  return (
    <div className="min-h-screen text-[var(--color-on-surface-variant)] relative pb-10 bg-transparent">
      <WavesBackground />
      <Header />
      <main className="relative z-10 pt-24 pb-14">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Activities />
        <Contact />
      </main>
      <StatusBar />
    </div>
  );
}
