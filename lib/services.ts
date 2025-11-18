// src/lib/services.ts
export type Service = {
  title: string;
  slug: string;
  tagline: string;
  problem: string;
  solution: string;
  deliverables: string[];
  techStack: string[];
  pricing: {
    name: string;
    description?: string;
    price?: string;
    features?: string[];
  }[];
  faq: { question: string; answer: string }[];
  caseStudies: { title: string; slug: string }[];
  tags?: string[];
  demoUrl?: string;
};

export const services: Service[] = [
  {
    title: "Data Scraping Based on Client Criteria",
    slug: "data-scraping",
    tagline: "Reliable, targeted data extraction from the sources that matter to you.",
    problem:
      "You need clean, structured data from multiple sources, on a schedule, with quality checks.",
    solution:
      "We design robust scrapers with proxy rotation, headless browsers and validation to deliver fresh, deduplicated datasets.",
    deliverables: [
      "Requirements & target-source audit",
      "Scraper pipeline & anti-bot strategy",
      "Data normalization & QA",
      "CSV/JSON/DB delivery + schedule",
      "Monitoring & failover alerts",
    ],
    techStack: [
      "Playwright/Puppeteer",
      "Node.js",
      "Python",
      "Proxies",
      "Supabase/Postgres",
      "S3/Blob",
    ],
    pricing: [
      {
        name: "Starter",
        price: "$799",
        description: "1–2 sources, up to 50k records",
        features: ["Basic anti-bot", "CSV/JSON export", "Email support"],
      },
      {
        name: "Growth",
        price: "$2,499",
        description: "Up to 5 sources, 300k+ records",
        features: ["Proxy rotation", "DB delivery", "Monitoring dashboard"],
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "High scale / complex sources",
        features: ["SLA & SSO", "Priority support", "Custom hosting"],
      },
    ],
    faq: [
      {
        question: "Is scraping legal?",
        answer:
          "We comply with robots.txt and applicable laws. We avoid login-gated sources unless you provide explicit permissions.",
      },
    ],
    caseStudies: [
      {
        title: "Scalable Data Scraping",
        slug: "data-scraping-case",
      },
    ],
    tags: ["Data", "Scraping"],
    demoUrl: "https://demo.zenithview.com/data-scraping",
  },

  {
    title: "Data Analysis & Visualization",
    slug: "data-analytics-visualization",
    tagline: "From raw data to decision-ready visuals.",
    problem: "You collect data but insights are buried and reports are manual.",
    solution:
      "We model, analyze and visualize metrics that matter, delivering dashboards that update automatically.",
    deliverables: ["Data audit", "Modeling", "Dashboards", "Report automation", "Anomaly alerts"],
    techStack: ["Python", "Pandas", "SQL", "Supabase", "Recharts", "Chart.js", "Next.js"],
    pricing: [
      { name: "Starter", price: "$1,200", features: ["1 dashboard", "Basic metrics", "Email support"] },
      { name: "Growth", price: "$3,000", features: ["3 dashboards", "Drilldowns", "Slack alerts"] },
      { name: "Enterprise", price: "Custom", features: ["Row-level security", "SSO", "SLA"] },
    ],
    faq: [],
    caseStudies: [
      {
        title: "Real-Time Analytics Dashboards",
        slug: "data-analytics-visualization-case",
      },
    ],
    tags: ["Analytics", "Dashboards"],
    demoUrl: "https://demo.zenithview.com/data-analytics-visualization",
  },

  {
    title: "Web Development",
    slug: "web-development",
    tagline: "Modern, performant websites and apps.",
    problem: "Legacy stacks and slow pages limit growth.",
    solution: "We build fast, secure sites with strong SEO and maintainable code.",
    deliverables: ["UX/UI", "Responsive build", "CMS setup", "SEO baseline", "Deployment & CI/CD"],
    techStack: ["Next.js 14", "TypeScript", "Tailwind", "Vercel", "Sanity / Supabase"],
    pricing: [
      { name: "Landing", price: "$1,500", features: ["1–3 pages", "CMS optional", "GA4"] },
      { name: "Site", price: "$4,500", features: ["5–10 pages", "Blog/CMS", "Contact flows"] },
      { name: "App", price: "Custom", features: ["Auth", "DB", "APIs", "Observability"] },
    ],
    faq: [],
    caseStudies: [
      {
        title: "Modern Web Platform",
        slug: "web-development-case",
      },
    ],
    tags: ["Web", "Frontend"],
    demoUrl: "https://demo.zenithview.com/web-development",
  },

  {
    title: "Graphics Design",
    slug: "graphics-design",
    tagline: "Brand-aligned visuals that stand out.",
    problem: "Inconsistent design lowers trust and conversions.",
    solution: "We deliver a clean system: logo, palette, components, templates.",
    deliverables: ["Brand kit", "Social templates", "Pitch deck", "Icons/illustrations"],
    techStack: ["Figma", "Adobe Suite", "Canva (handoff)"],
    pricing: [
      { name: "Starter", price: "$600", features: ["Logo + palette", "Basic templates"] },
      { name: "Brand Kit", price: "$1,800", features: ["System + deck", "Components"] },
      { name: "On-going", price: "$1,000/mo", features: ["Monthly assets", "Priority queue"] },
    ],
    faq: [],
    caseStudies: [
      {
        title: "Brand Identity Refresh",
        slug: "graphics-design-case",
      },
    ],
    tags: ["Design"],
    demoUrl: "https://demo.zenithview.com/graphics-design",
  },

  {
    title: "Video Post Production",
    slug: "video-post-production",
    tagline: "Edit, color, sound, and graphics for compelling stories.",
    problem: "Raw footage needs professional polish and speed.",
    solution: "We handle editing, grading, motion graphics, captions and exports.",
    deliverables: ["Edit & color", "Motion graphics", "Captions", "Social cuts"],
    techStack: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
    pricing: [
      { name: "Short-form", price: "$400", features: ["≤60s", "Captions", "1 round of edits"] },
      { name: "Long-form", price: "$1,200", features: ["3–10 mins", "Graphics", "2 rounds"] },
      { name: "Retainer", price: "Custom", features: ["Monthly batch", "Priority queue"] },
    ],
    faq: [],
    caseStudies: [
      {
        title: "Video Marketing Enhancement",
        slug: "video-post-production-case",
      },
    ],
    tags: ["Video"],
    demoUrl: "https://demo.zenithview.com/video-post-production",
  },

  {
    title: "AI Automation",
    slug: "ai-automation",
    tagline: "Automate workflows with reliable AI agents and triggers.",
    problem: "Teams spend time on repetitive tasks; processes don’t scale.",
    solution: "We build automations connecting your tools with serverless functions and AI.",
    deliverables: ["Process map", "Automation build", "Human-in-the-loop", "Monitoring"],
    techStack: ["Node.js", "Next.js", "Supabase", "OpenAI/Claude", "Zapier/Make"],
    pricing: [
      { name: "Pilot", price: "$1,000", features: ["1 workflow", "Basic guardrails"] },
      { name: "Ops Pack", price: "$3,500", features: ["3–5 workflows", "Dashboards"] },
      { name: "Enterprise", price: "Custom", features: ["SOC2 patterns", "LLM observability"] },
    ],
    faq: [],
    caseStudies: [
      {
        title: "Operational AI Automation",
        slug: "ai-automation-case",
      },
    ],
    tags: ["AI", "Automation"],
    demoUrl: "https://demo.zenithview.com/ai-automation",
  },

{
  title: "Facebook Competitor Watchdog",
  slug: "facebook-competitor-watchdog",
  tagline: "Real-time competitor ad intelligence — creatives, spend signals, and messaging trends.",
  
  problem:
    "Teams manually check the Meta Ad Library, screenshot ads, and lose information in scattered Slack threads and Notion pages. There is no historical tracking, no automated alerts, and no way to see which competitors are increasing spend or what creative angles they are testing. As a result, creative strategy becomes reactive and guess-based instead of data-driven.",

  solution:
    "Our Watchdog system continuously monitors competitors inside the Meta Ad Library, captures every creative variation, classifies hooks and formats, and generates actionable insights. You get a live dashboard, weekly intelligence summaries, creative trends, and alerts whenever a competitor increases spend or drops a new batch of ads.",

  deliverables: [
    "Competitor list setup",
    "Real-time Meta Ad Library ingestion",
    "Creative tagging (hooks, formats, angles)",
    "Historical archive of competitor ads",
    "Trend dashboards & creative volume charts",
    "Daily/Weekly alert reports"
  ],

  techStack: [
    "Meta Ad Library API",
    "Playwright / Puppeteer (fallback)",
    "Python / Node.js",
    "PostgreSQL / Prisma",
    "Next.js Dashboard",
    "Recharts / D3 Visualizations"
  ],

  pricing: [
    {
      name: "Free",
      price: "$0.00",
      features: [
        "Track 3 competitors",
        "Weekly insight summaries",
        "Basic creative archive"
      ]
    },
    {
      name: "Growth",
      price: "$5.00",
      features: [
        "Track 10 competitors",
        "Daily alerts on new creatives",
        "Creative tagging (hooks / formats)",
        "Trend dashboards"
      ]
    },
    {
      name: "Enterprise",
      price: "$20.00",
      features: [
        "Unlimited competitors",
        "Spend pattern intelligence",
        "API access",
        "Custom dashboards & Slack alerts"
      ]
    }
  ],

  faq: [
    {
      question: "How often does the Watchdog scan competitor ads?",
      answer:
        "Depending on the plan, the system scans competitors daily or weekly, capturing all changes and storing historical versions."
    },
    {
      question: "Can it detect competitor spend?",
      answer:
        "Meta does not expose exact spend, but Watchdog uses creative frequency, rollout patterns, and ad burst behavior to estimate spend intensity."
    },
    {
      question: "Do I need API access from Meta?",
      answer:
        "No. We use a compliant combination of Meta’s public Ad Library search endpoints and safe automation fallbacks."
    }
  ],

  caseStudies: [
    {
      title: "Ad Intelligence Watchdog",
      slug: "facebook-competitor-watchdog-case"
    }
  ],

  tags: ["Watchdog", "Marketing", "Ad Intelligence", "Competitive Research"],

  demoUrl: "https://ad-analyzer-3dwj.onrender.com/"
},


  {
    title: "E-Commerce Package",
    slug: "ecommerce-package",
    tagline: "Everything to launch or modernize your store.",
    problem: "Catalog, payments, analytics and UX need to work together.",
    solution: "We set up storefronts, payments, tracking and conversion flows.",
    deliverables: ["Store setup", "Theme & UX", "Payments & shipping", "Analytics"],
    techStack: ["Next.js", "Shopify/Medusa", "Stripe", "GA4/Plausible"],
    pricing: [
      { name: "Launch", price: "$2,500", features: ["Catalog", "Theme", "Payments"] },
      { name: "Growth", price: "$5,500", features: ["Apps", "Tracking", "Email flows"] },
      { name: "Custom", price: "Custom", features: ["Headless", "Complex ops"] },
    ],
    faq: [],
    caseStudies: [
      {
        title: "E-Commerce Transformation",
        slug: "ecommerce-package-case",
      },
    ],
    tags: ["E-Commerce"],
    demoUrl: "https://demo.zenithview.com/ecommerce-package",
  },

  {
    title: "Business Email Solutions",
    slug: "business-email-solutions",
    tagline: "Secure, scalable email for your team and domains.",
    problem: "Unreliable email and poor deliverability hurt your brand.",
    solution: "We set up professional email with proper authentication and admin controls.",
    deliverables: ["Domain setup", "MX/SPF/DKIM/DMARC", "Migrations", "Policies & admin"],
    techStack: ["Google Workspace", "Microsoft 365", "Cloudflare", "DMARC"],
    pricing: [
      { name: "Setup", price: "$400", features: ["Domain & DNS", "Auth records"] },
      { name: "Migrate", price: "$900", features: ["Mailbox moves", "Testing"] },
      { name: "Manage", price: "$150/mo", features: ["Admin & support", "Policies"] },
    ],
    faq: [],
    caseStudies: [
      {
        title: "Enterprise Email Overhaul",
        slug: "business-email-solutions-case",
      },
    ],
    tags: ["Email", "IT"],
    demoUrl: "https://demo.zenithview.com/business-email-solutions",
  },

  {
    title: "Custom Build (Client Criteria)",
    slug: "client-criteria",
    tagline: "Tell us exactly what you need — we’ll scope and ship.",
    problem: "Off-the-shelf doesn’t fit your exact requirements.",
    solution: "We run a short discovery, propose options, then deliver a focused PoC or build.",
    deliverables: ["Discovery", "Proposal", "PoC/Build", "Handover & docs"],
    techStack: ["As needed"],
    pricing: [{ name: "PoC", price: "$2,000", features: ["2-week sprint", "Demo & docs"] }],
    faq: [],
    caseStudies: [
      {
        title: "Custom Solution PoC",
        slug: "custom-build-case",
      },
    ],
    tags: ["Custom"],
    demoUrl: "https://demo.zenithview.com/client-criteria",
  },
];
