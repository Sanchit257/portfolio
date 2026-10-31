export const RESUME_URL = "/Sanchit_Kaushik_Resume.pdf";
export const CONSULTING_URL = "https://ez-it-consulting.vercel.app/";
export const EMAIL = "sk010us@gmail.com";
export const GITHUB_URL = "https://github.com/Sanchit257";
export const LINKEDIN_URL = "https://www.linkedin.com/in/sanc-k";
export const ROLE_LINE =
  "IT Specialist & Consultant | Software Developer | Cybersecurity Enthusiast";

export const SECTIONS = [
  { id: "hero", code: "MAIN MENU", plain: "Top", intel: "Return to the main menu." },
  { id: "about", code: "AGENT FILES", plain: "About", intel: "Personnel file. Background and education." },
  { id: "experience", code: "CAMPAIGN", plain: "Experience", intel: "Field deployments and objectives completed." },
  { id: "projects", code: "MISSIONS", plain: "Projects", intel: "The home lab, mapped out site by site." },
  { id: "certifications", code: "COMMENDATIONS", plain: "Certifications", intel: "Earned and in-progress credentials." },
  { id: "skills", code: "LOADOUT", plain: "Skills", intel: "Equipped languages, tools and tradecraft." },
  { id: "activities", code: "SIDE OPS", plain: "Activities", intel: "Off-duty organizing and teaching." },
  { id: "contact", code: "COMMS", plain: "Contact", intel: "Open a secure channel." },
] as const;

export const RANKS = [
  "RECRUIT",
  "PRIVATE",
  "CORPORAL",
  "SERGEANT",
  "LIEUTENANT",
  "CAPTAIN",
  "MAJOR",
  "COMMANDER",
];

/** Bullets match the resume. `x` and `y` place each pin on the tactical map, in percent. */
export const HOME_LAB = {
  title: "Home Lab",
  tech: "n8n, ML, SCADA, Docker, Entra ID, Azure, Splunk, Linux, Burp",
  date: "Aug. 2026 – Current",
  sites: [
    {
      id: "pentest",
      label: "Pentest range",
      text: "Performed pentesting (recon and web-app/remote exploitation) & threat detection with 4 VMs",
      x: 22,
      y: 30,
    },
    {
      id: "scada",
      label: "SCADA",
      text: "Simulated SCADA monitoring system using Python & Dockerized n8n that processed 120,000+ telemetry logs",
      x: 66,
      y: 22,
    },
    {
      id: "entra",
      label: "Entra ID",
      text: "Simulated Entra ID by automating account creation via PowerShell scripting & resolving help desk tickets",
      x: 52,
      y: 62,
    },
    {
      id: "minecraft",
      label: "Minecraft",
      text: "Hosting a configured Minecraft server using Ubuntu Linux with support for up to 5 players",
      x: 16,
      y: 76,
    },
  ],
};

export type LoadoutItem = { name: string; lab?: boolean };

/** `lab` links a skill to the home lab, whose resume entry names it. */
export const LOADOUT: {
  id: string;
  slot: string;
  title: string;
  items: LoadoutItem[];
}[] = [
  {
    id: "primary",
    slot: "PRIMARY",
    title: "Cyber",
    items: [
      { name: "Networking Fundamentals" },
      { name: "Nmap" },
      { name: "Wireshark" },
      { name: "Tcpdump" },
      { name: "Cable Management" },
      { name: "Troubleshooting" },
      { name: "Virtualization" },
      { name: "Documentation" },
      { name: "Network Traffic Analysis" },
    ],
  },
  {
    id: "secondary",
    slot: "SECONDARY",
    title: "Programming Languages",
    items: [
      { name: "Python", lab: true },
      { name: "JavaScript" },
      { name: "C/C++" },
      { name: "HTML5" },
      { name: "SQL" },
      { name: "JAVA" },
      { name: "BASH" },
      { name: "React" },
    ],
  },
  {
    id: "equipment",
    slot: "EQUIPMENT",
    title: "Tools",
    items: [
      { name: "GitHub/Git" },
      { name: "AWS" },
      { name: "Docker", lab: true },
      { name: "Linux", lab: true },
      { name: "Splunk", lab: true },
      { name: "Burp Suite", lab: true },
      { name: "Active Directory" },
      { name: "MS Azure", lab: true },
      { name: "MS & Google Suite" },
    ],
  },
];

export const CAMPAIGN = [
  {
    title: "IT Automation Intern",
    org: "Irvine Ranch Water District",
    place: "Irvine, CA",
    period: "Oct. 2026 – Present",
    active: true,
    link: undefined,
    objectives: [
      "Built event-driven industrial monitoring setups & SCADA tools using Python, MQTT, & Dockerized n8n",
      "Cut down manual support by engineering RAG pipelines on help desk tickets with the use of automation scripts",
      "Administered Azure cloud environments & server patch management while auditing security logs with Splunk",
    ],
    tags: ["SCADA", "n8n", "Azure", "Splunk"],
  },
  {
    title: "Information Technology Intern",
    org: "Blackmore Partners",
    place: "Remote",
    period: "Aug. 2026 – Present",
    active: true,
    link: undefined,
    objectives: [
      "Re-engaged 4,000+ executive contacts by managing automated outreach workflows to improve engagement",
      "Enabled self-service support for 100+ employees/partners by building a RAG pipeline based on corporate CRM",
      "Restored email functionality & unblocked accounts for affected users by resolving high-severity MS 365 alerts",
    ],
    tags: ["Automation", "RAG", "CRM", "MS 365"],
  },
  {
    title: "IT and Cybersecurity Consultant",
    org: "EZ IT Consulting",
    place: "Cypress, CA",
    period: "July 2026 – Present",
    active: true,
    link: { href: CONSULTING_URL, label: "Free IT consulting service — ez-it-consulting.vercel.app" },
    objectives: [
      "Resolved technical issues for 10+ clients by gathering information and narrowing down root causes",
      "Upgraded client security by auditing for outdated OS versions & reconfiguring admin Wi-Fi credentials",
      "Helped set up & move around desks, home office equipment, PCs, monitors, & printers for clients",
    ],
    tags: ["IT Support", "Security"],
  },
  {
    title: "Application Security Engineer",
    org: "Association for Computing Machinery",
    place: "Long Beach, CA",
    period: "Sept. 2025 – Present",
    active: true,
    link: undefined,
    objectives: [
      "Built prod-ready web apps & ran security audits using automated static analysis & dependency scanning",
      "Probed APIs and endpoints via OWASP ZAP and Burp Suite to uncover injection flaws & insecure file uploads",
      "Secured container infra with Docker Scout while drafting code patches for OWASP Top 10 vulnerabilities",
    ],
    tags: ["OWASP ZAP", "Burp Suite", "Docker Scout"],
  },
  {
    title: "Full Stack Developer",
    org: "AWS x DxHUB",
    place: "San Luis Obispo, CA",
    period: "June 2026 – July 2026",
    active: false,
    link: undefined,
    objectives: [
      "Aligned solutions with stakeholder needs on discovery calls with the CSUB Dean to surface advising pain points",
      "Improved advising for 25+ faculty members by architecting an AWS web app that generates schedules and plans",
      "Built a RAG pipeline with AI-driven guidance to help faculty advise courses for 1000+ freshmen every year",
    ],
    tags: ["AWS", "RAG", "Full Stack"],
  },
];

export const CERTS = [
  {
    title: "CompTIA Network+",
    issuer: "(N10-009)",
    earned: true,
    image: "/comptia-network-plus.png",
    certificateUrl: "/CompTIA-Network-Plus-Certificate.pdf",
    certificateName: "CompTIA-Network-Plus-Certificate.pdf",
  },
  {
    title: "Cisco Certified Network Associate",
    issuer: "(200-301)",
    earned: false,
    image: "/ccna-badge.png",
    certificateUrl: null,
    certificateName: null,
  },
];

export const SIDE_OPS = [
  {
    title: "BeachHacks",
    logo: "/beachhacks-logo.png",
    role: "Sponsorship and Logistics Committee",
    period: "Sep 2025 - Mar 2026",
    detail: "Hackathon organizer and Funds Overseer",
  },
  {
    title: "Dreams for schools",
    logo: "/dreams-for-schools-logo.png",
    role: "Program Instructor",
    period: "Aug 2024 - Aug 2025",
    detail: "Taught STEM activities to elementary school students",
  },
];

/** The end-of-match scoreboard. Counted from the data above, never invented. */
export const SCOREBOARD = [
  { label: "Lab sites", value: String(HOME_LAB.sites.length) },
  { label: "Deployments", value: String(CAMPAIGN.length) },
  { label: "Certs earned", value: String(CERTS.filter((c) => c.earned).length) },
  { label: "Certs in progress", value: String(CERTS.filter((c) => !c.earned).length) },
  { label: "Side ops", value: String(SIDE_OPS.length) },
  { label: "GPA", value: "3.5" },
];
