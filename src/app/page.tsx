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
import { Rail } from "@/components/portfolio/Rail";

export default function Home() {
  return (
    <>
      <ColdOpen />
      <Fx />
      <Hud />
      <Rail>
        <Hero />
        <Dossier />
        <Campaign />
        <Missions />
        <Commendations />
        <Loadout />
        <SideOps />
        <Comms />
        <div className="panel-end">
          <Scoreboard />
          <Footer />
        </div>
      </Rail>
    </>
  );
}
