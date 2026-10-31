export const RESUME_URL = "/Sanchit_Kaushik_Resume.pdf";
export const CONSULTING_URL = "https://ez-it-consulting.vercel.app/";
export const EMAIL = "sk010us@gmail.com";
export const GITHUB_URL = "https://github.com/Sanchit257";
export const LINKEDIN_URL = "https://www.linkedin.com/in/sanchitka";
export const ROLE_LINE =
  "IT Specialist & Consultant | Software Developer | Cybersecurity Enthusiast";

export const SECTIONS = [
  { id: "hero", code: "MAIN MENU", plain: "Top", intel: "Return to the main menu." },
  { id: "about", code: "DOSSIER", plain: "About", intel: "Personnel file. Background and education." },
  { id: "skills", code: "LOADOUT", plain: "Skills", intel: "Equipped languages, tools and tradecraft." },
  { id: "experience", code: "CAMPAIGN", plain: "Experience", intel: "Field deployments and objectives completed." },
  { id: "projects", code: "MISSIONS", plain: "Projects", intel: "Select an operation from the tactical map." },
  { id: "certifications", code: "COMMENDATIONS", plain: "Certifications", intel: "Earned and in-progress credentials." },
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

/** Every entry is taken from a real bullet in Experience or Projects. */
export const KILLFEED = [
  "Account lockouts",
  "GPO / RDP access issues",
  "Suspicious logins",
  "Outdated firmware",
  "Weak Wi-Fi passwords",
  "Manual ADUC workflows",
  "Student advising pain points",
  "Server downtime",
];

export type Mission = {
  id: string;
  op: string;
  title: string;
  tech: string;
  date: string;
  desc: string[];
  githubUrl?: string;
  /** Pin position on the tactical map, in percent. */
  x: number;
  y: number;
};

export const MISSIONS: Mission[] = [
  {
    id: "ad",
    op: "IRON DOMAIN",
    title: "Enterprise Active Directory Lab",
    tech: "Active Directory, Microsoft Azure",
    date: "August 2026",
    desc: [
      "Automated Active Directory user and group provisioning with PowerShell, replacing manual ADUC workflows with repeatable, scalable account-management scripts.",
      "Troubleshot account lockouts and GPO/RDP access issues by analyzing Active Directory logs, PowerShell/CMD diagnostics, and configuration settings to identify and resolve root causes.",
      "Configured and enforced Group Policy controls for password policies and endpoint restrictions across domain-joined clients, while deploying and troubleshooting the environment on Microsoft Azure infrastructure.",
    ],
    githubUrl: "https://github.com/Sanchit257/AD-lab",
    x: 74,
    y: 24,
  },
  {
    id: "ceo",
    op: "GOLDEN PARACHUTE",
    title: "CEO Account Takeover",
    tech: "Wazuh GitHub",
    date: "July 2026",
    desc: [
      "Triaged and investigated simulated CEO account-takeover activity in Wazuh, analyzing authentication, account, file, and process events to distinguish relevant security activity from routine alerts.",
      "Developed and validated custom Wazuh detection rules for suspicious logins, administrator creation, sensitive file access, downloads, and process execution, troubleshooting detection and telemetry issues through repeatable attack simulations.",
      "Correlated endpoint events into an incident timeline using Python and FastAPI, enabling systematic investigation from initial authentication activity through post-compromise actions and supporting evidence-based incident reporting.",
    ],
    githubUrl: "https://github.com/Sanchit257/account-takeover-of-ceo",
    x: 50,
    y: 62,
  },
  {
    id: "range",
    op: "RED RANGE",
    title: "Virtualized Pentesting and Threat Detection",
    tech: "Splunk, Burp, nmap",
    date: "July 2026",
    desc: [
      "Built and operated an isolated 4-VM cyber range to simulate realistic attacker and defender workflows across segmented virtualized infrastructure.",
      "Conducted reconnaissance and simulated web/remote exploitation against vulnerable systems, tracing attack activity across the environment to evaluate detection and response capabilities.",
      "Investigated attack telemetry using Suricata IDS and Splunk, correlating alerts into an incident timeline, documenting IOCs, identifying root causes, and developing remediation recommendations.",
    ],
    githubUrl: "https://github.com/Sanchit257/cyber_range",
    x: 28,
    y: 34,
  },
  {
    id: "minecraft",
    op: "OVERWORLD",
    title: "Self-Hosted Minecraft Server",
    tech: "Linux, Cable Management, Troubleshooting",
    date: "June 2026",
    desc: [
      "Engineered & Deployed Dedicated Linux Infrastructure: Hosted a dedicated Minecraft server environment on Ubuntu Linux using Crafty Controller, managing system background services (systemctl), background process isolation, and resource allocation.",
      "Configured Zero-Trust Network Tunneling: Implemented secure WAN connectivity and automated port forwarding via Playit.gg, enabling low-latency remote user access without exposing local network infrastructure to direct public inbound routes.",
      "Automated System Resiliency & Power Management: Authored system-level service configurations and power policy overrides to guarantee high availability, enabling automated boot-time initialization, auto-recovery upon host restarts, and continuous 24/7 server uptime.",
    ],
    x: 16,
    y: 76,
  },
];

export type LoadoutItem = { name: string; mission?: string };

/** `mission` links a skill to the project whose write-up names it. */
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
      { name: "Nmap", mission: "range" },
      { name: "Wireshark" },
      { name: "Tcpdump" },
      { name: "Cable Management", mission: "minecraft" },
      { name: "Troubleshooting", mission: "minecraft" },
      { name: "Virtualization", mission: "range" },
      { name: "Documentation", mission: "range" },
      { name: "Network Traffic Analysis" },
    ],
  },
  {
    id: "secondary",
    slot: "SECONDARY",
    title: "Programming Languages",
    items: [
      { name: "Python", mission: "ceo" },
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
      { name: "Docker" },
      { name: "Linux", mission: "minecraft" },
      { name: "Splunk", mission: "range" },
      { name: "Burp Suite", mission: "range" },
      { name: "Active Directory", mission: "ad" },
      { name: "MS Azure", mission: "ad" },
      { name: "MS & Google Suite" },
    ],
  },
];

export const CAMPAIGN = [
  {
    title: "IT Consultant @ EZ IT Consulting",
    place: "Cypress, CA",
    period: "August 2026 - Current",
    active: true,
    link: { href: CONSULTING_URL, label: "Free IT consulting service — ez-it-consulting.vercel.app" },
    objectives: [
      "Diagnosed technical problems by gathering information about the issue, identifying symptoms, and narrowing down potential causes.",
      "Troubleshot hardware, operating system, software, and connectivity problems using a structured, step-by-step approach.",
      "Reviewed wireless network configurations for common security weaknesses.",
      "Reviewed systems for outdated operating systems, applications, and network-device firmware.",
      "Configured stronger Wi-Fi passwords and secure administrative credentials.",
      "Recommended practical improvements such as stronger authentication, firmware updates, network segmentation, and disabling unnecessary services when appropriate.",
    ],
    tags: ["IT Support", "Networking", "Security"],
  },
  {
    title: "AWS x DxHub Summer Camp",
    place: "California PolyTechnic University, San Luis Obispo",
    period: "June 2026 - July 2026",
    active: false,
    link: undefined,
    objectives: [
      "Led stakeholder discovery calls with the Dean of CSU Bakersfield to identify student advising pain points and translate them into technical project requirements",
      "Developed a 100% scalable full-stack web application on AWS that dynamically generates block schedules and prerequisite maps for incoming students",
      "Built a RAG pipeline for CSUB faculty enabling personalized, AI-driven course guidance for over 1,000 incoming freshmen each year",
      "Collaborated cross-functionally with university leadership, faculty, and engineers to deliver a production-ready solution within a compressed timeline",
      "Gained hands-on experience with AWS cloud infrastructure, full-stack development, and AI-driven application design in a real-world client engagement",
    ],
    tags: ["AWS", "Full-Stack Web Dev", "AI-Engineering"],
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
  { label: "Missions run", value: String(MISSIONS.length) },
  { label: "Deployments", value: String(CAMPAIGN.length) },
  { label: "Certs earned", value: String(CERTS.filter((c) => c.earned).length) },
  { label: "Certs in progress", value: String(CERTS.filter((c) => !c.earned).length) },
  { label: "Side ops", value: String(SIDE_OPS.length) },
  { label: "GPA", value: "3.5" },
];
