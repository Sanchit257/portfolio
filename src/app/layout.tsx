import type { Metadata, Viewport } from "next";
import {
  Barlow_Semi_Condensed,
  Big_Shoulders_Stencil,
  Share_Tech_Mono,
  Special_Elite,
} from "next/font/google";
import { Embers } from "@/components/portfolio/Embers";
import "./globals.css";

const display = Big_Shoulders_Stencil({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "800", "900"],
});

const body = Barlow_Semi_Condensed({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Share_Tech_Mono({
  variable: "--font-hud",
  subsets: ["latin"],
  weight: "400",
});

const typewriter = Special_Elite({
  variable: "--font-type",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sanchit Kaushik — Portfolio",
  description:
    "IT Specialist & Consultant | Software Developer | Cybersecurity Enthusiast",
};

export const viewport: Viewport = {
  themeColor: "#0b0d0a",
};

// Runs before first paint so the intro never flashes the page underneath,
// and so reveal animations only hide content when JS can bring it back.
// html.intro: play the intro this page view (once a session, home page only).
// html.intro-still: reduced motion or Save-Data, so show the static poster.
const bootScript = `(function(){var r=document.documentElement;r.classList.add('js');try{if(!sessionStorage.getItem('sk-intro')&&!location.hash&&!location.search&&location.pathname==='/'){r.classList.add('intro');var c=navigator.connection;if(matchMedia('(prefers-reduced-motion: reduce)').matches||(c&&c.saveData))r.classList.add('intro-still')}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable} ${typewriter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full">
        <Embers />
        {children}
      </body>
    </html>
  );
}
