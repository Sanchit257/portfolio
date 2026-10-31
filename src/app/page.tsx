import { ColdOpen } from "@/components/portfolio/ColdOpen";
import { Hud } from "@/components/portfolio/Hud";
import { Fx } from "@/components/portfolio/Fx";
import { Hero } from "@/components/portfolio/Hero";
import { Dossier } from "@/components/portfolio/Dossier";
import { Loadout } from "@/components/portfolio/Loadout";
import { Campaign } from "@/components/portfolio/Campaign";
import { Missions } from "@/components/portfolio/Missions";
import { Commendations } from "@/components/portfolio/Commendations";
import { SideOps } from "@/components/portfolio/SideOps";
import { Comms } from "@/components/portfolio/Comms";
import { Scoreboard } from "@/components/portfolio/Scoreboard";
import { Footer } from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <>
      <ColdOpen />
      <Fx />
      <Hud />
      <main className="relative">
        <Hero />
        <Dossier />
        <Loadout />
        <Campaign />
        <Missions />
        <Commendations />
        <SideOps />
        <Comms />
        <Scoreboard />
      </main>
      <Footer />
    </>
  );
}
