"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Target,
  Activity,
  Sparkles,
  Info,
  Mail,
  Link,
  FileText,
  Eye,
  Layers,
  Lightbulb,
  Zap,
  Briefcase,
  GraduationCap,
} from "lucide-react";

/* ─── Real Data from Resume ─── */

export interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  role: string;
  company: string;
  timeline: string;
  accentColor: string;
  accentBg: string;
  highlights: string[];
}

export const PROJECTS: ProjectData[] = [
  {
    id: "ai-fiesta",
    title: "AI Fiesta",
    tagline: "Multi-AI platform integrating ChatGPT, Gemini, Claude & Grok into one unified experience.",
    role: "Product Designer",
    company: "By Dhruv Rathee · Fleapo",
    timeline: "Feb 2026 – Present",
    accentColor: "#818cf8",
    accentBg: "#1a1530",
    highlights: [
      "Designed seamless multi-AI user experiences integrating models like ChatGPT, Gemini, Claude, and Grok into a unified platform.",
      "Crafted intuitive dashboards, chat interfaces, and AI workflow systems focused on accessibility, clarity, and high engagement.",
      "Built scalable UI systems and modern interaction patterns optimized for fast-growing AI-powered digital products.",
    ],
  },
  {
    id: "tagmango",
    title: "TagMango",
    tagline: "India's leading content creator monetisation platform for courses, memberships & communities.",
    role: "Product Designer",
    company: "Fleapo",
    timeline: "Feb 2026 – Present",
    accentColor: "#fb923c",
    accentBg: "#1f1510",
    highlights: [
      "Designed creator-focused experiences for workshops, courses, memberships, and community-driven learning ecosystems.",
      "Improved user journeys across onboarding, content discovery, payments, and creator monetisation workflows.",
      "Contributed to scalable and conversion-focused interfaces for one of India's leading creator economy platforms.",
    ],
  },
  {
    id: "asseteye",
    title: "AssetEye",
    tagline: "Enterprise web platform for Denmark — data-intensive dashboards serving 500+ users.",
    role: "UX / UI Designer",
    company: "Growth Loops Technology",
    timeline: "Sep 2025 – Feb 2026",
    accentColor: "#34d399",
    accentBg: "#0b1a14",
    highlights: [
      "Architected end-to-end UX for enterprise workflows including onboarding, dashboards, and data-intensive screens serving 500+ users.",
      "Restructured information hierarchy for complex tables, filters, and multi-step navigation, improving task success rate by 41%.",
      "Established scalable UI patterns using reusable components and responsive layouts, achieving 95% cross-device consistency.",
    ],
  },
  {
    id: "nuros-ai",
    title: "Nuros AI",
    tagline: "Artificial intelligence product — reducing learning curve by 60% vs competitors.",
    role: "UX / UI Designer",
    company: "Growth Loops Technology",
    timeline: "Sep 2025 – Feb 2026",
    accentColor: "#22d3ee",
    accentBg: "#0a1620",
    highlights: [
      "Crafted intuitive AI interaction model, reducing learning curve by 60% compared to competitor products.",
      "Developed high-fidelity prototypes validated through 15+ user testing sessions, achieving 88% first-time task completion.",
      "Built scalable design patterns integrated with company-wide system used across 4 product teams.",
    ],
  },
  {
    id: "posture-pal",
    title: "Posture Pal",
    tagline: "Health tracking mobile app — 10,000+ downloads in first 3 months.",
    role: "UX / UI Designer",
    company: "PurpleMerit",
    timeline: "May 2025 – Sep 2025",
    accentColor: "#f472b6",
    accentBg: "#1a0a14",
    highlights: [
      "Led complete mobile app design from research through launch, achieving 10,000+ downloads in first 3 months.",
      "Implemented gamification strategy, increasing daily active users by 67% and average session time by 3.2 minutes.",
      "Ensured accessible design meeting WCAG 2.1 AA standards, expanding user base to include individuals with disabilities.",
    ],
  },
  {
    id: "framix",
    title: "Framix",
    tagline: "Enterprise design system — 80+ components, 94% adoption rate across 15+ team members.",
    role: "UX / UI Designer",
    company: "PurpleMerit",
    timeline: "Jun 2025 – Sep 2025",
    accentColor: "#a78bfa",
    accentBg: "#15102a",
    highlights: [
      "Constructed comprehensive design system with 80+ components, design tokens, and documentation serving 15+ team members.",
      "Eliminated 85% of design inconsistencies and reduced development time by 40% through reusable component library.",
      "Facilitated usability testing with designers and engineers, iterating based on feedback to achieve 94% adoption rate.",
    ],
  },
];

export const EXPERIENCE: {
  title: string;
  company: string;
  location: string;
  timeline: string;
  bullets: string[];
}[] = [
  {
    title: "Product Designer",
    company: "Fleapo",
    location: "Kolkata",
    timeline: "Feb 2026 – Present",
    bullets: [
      "Working on AI Fiesta, TagMango, Backstage Pass, Shikkha & GradX",
      "Designing premium UI/UX for fast-growing platforms across AI, creator economy, and EdTech",
      "Crafting user-centric interfaces focused on aesthetics, usability, and modern interaction design",
    ],
  },
  {
    title: "UX / UI Designer",
    company: "Growth Loops Technology",
    location: "Kolkata",
    timeline: "Sep 2025 – Feb 2026",
    bullets: [
      "Designed 100+ screens for AssetEye enterprise platform, reducing task completion time by 35%",
      "Led Nuros AI product design from research to launch, achieving 92% user satisfaction",
      "Architected design system with 50+ components, accelerating development by 40%",
    ],
  },
  {
    title: "UX / UI Designer",
    company: "PurpleMerit",
    location: "Remote",
    timeline: "May 2025 – Aug 2025",
    bullets: [
      "Launched Posture Pal health app — 4.6/5 rating, 1,000+ active users",
      "Established Framix design system adopted by 5 designers and 10 engineers",
      "Developed PurpleMerit website in Framer, boosting lead generation by 65%",
    ],
  },
  {
    title: "Freelance UX / UI Designer",
    company: "Upwork",
    location: "Remote",
    timeline: "Jul 2024 – May 2025",
    bullets: [
      "8+ client projects across SaaS, analytics, AI tools — 100% satisfaction, 5-star ratings",
      "UX audits for 3 startups, driving 52% average conversion rate increase",
    ],
  },
];

export const SKILLS = [
  "Prototyping", "Design Systems", "Figma", "Framer",
  "Interaction Design", "Visual Design", "Responsive Design",
  "Mobile-First Design", "UX Architecture", "Wireframing",
  "Usability Testing", "Journey Mapping", "Empathy Mapping",
  "HTML", "CSS", "Accessibility (WCAG)",
];

export const PHILOSOPHY_ITEMS = [
  {
    icon: Eye,
    title: "Intentional Restraint",
    description: "Every element must earn its place. If it doesn't serve the user's goal, it doesn't exist.",
  },
  {
    icon: Layers,
    title: "Layered Discovery",
    description: "Great products reveal themselves gradually. The best details are found, not shown.",
  },
  {
    icon: Lightbulb,
    title: "Cognitive Respect",
    description: "Design for human attention, not against it. Reduce decisions. Increase clarity.",
  },
  {
    icon: Zap,
    title: "Visceral Feedback",
    description: "Every interaction should feel physical. Micro-animations aren't decoration — they're communication.",
  },
];

export const ABOUT_DATA = {
  name: "Mohammed Hammad Zia",
  shortName: "Hammad Zia",
  age: "21",
  role: "Product Designer",
  otherRoles: "Customer Experience Designer · Prompt Engineer",
  location: "Kolkata, India",
  bio: "Senior Product Designer with 3+ years designing enterprise SaaS, AI products, and mobile applications. Delivered 16+ products with measurable impact: 92% user satisfaction, 65% lead generation growth, and 40% faster development cycles. Expert in design systems, user research, and cross-functional collaboration.",
  status: "Open to opportunities",
  education: "B.Com (Hons.) · Industrial Product Design Mastery",
};

export const CONTACT_DATA = {
  email: "hammadzia092004@gmail.com",
  phone: "(+91) 7439251050",
  behance: "https://www.behance.net/hammadzia2",
  linkedin: "https://www.linkedin.com/in/ui-ux-hammad/?skipRedirect=true",
  resume: "/UX.HAMMAD.pdf",
  closingLine: "The internet has enough products. Let's build one worth remembering.",
};

/* ─── Content Renderers ─── */

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

interface ArtboardContentProps {
  contentId: string;
  compact?: boolean;
}

export default function ArtboardContent({ contentId, compact = false }: ArtboardContentProps) {
  switch (contentId) {
    case "about":
      return <AboutContent compact={compact} />;
    case "experience":
      return <ExperienceContent compact={compact} />;
    case "philosophy":
      return <PhilosophyContent compact={compact} />;
    case "contact":
      return <ContactContent compact={compact} />;
    case "skills":
      return <SkillsContent compact={compact} />;
    default: {
      const project = PROJECTS.find((p) => p.id === contentId);
      if (project) return <ProjectContent project={project} compact={compact} />;
      return null;
    }
  }
}

/* ─── About ─── */
function AboutContent({ compact }: { compact: boolean }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={compact ? "p-4" : "p-8 md:p-12"}
    >
      <div className={compact ? "space-y-3" : "space-y-6"}>
        <div>
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.15em] block mb-1">
            Identity
          </span>
          <h2 className={`font-heading font-bold tracking-tight text-foreground ${compact ? "text-xl" : "text-4xl md:text-5xl"}`}>
            {ABOUT_DATA.shortName}
          </h2>
          <p className={`text-text-secondary font-normal ${compact ? "text-xs mt-1" : "text-sm mt-2"}`}>
            {ABOUT_DATA.role} · {ABOUT_DATA.otherRoles}
          </p>
        </div>

        <div className={`grid grid-cols-2 gap-3 font-mono uppercase tracking-wider ${compact ? "text-[10px]" : "text-xs"}`}>
          <div>
            <span className="text-text-tertiary block mb-0.5">Location</span>
            <span className="text-foreground">{ABOUT_DATA.location}</span>
          </div>
          <div>
            <span className="text-text-tertiary block mb-0.5">Experience</span>
            <span className="text-foreground">3+ Years</span>
          </div>
          <div>
            <span className="text-text-tertiary block mb-0.5">Products</span>
            <span className="text-foreground">16+ Delivered</span>
          </div>
          <div>
            <span className="text-text-tertiary block mb-0.5">Status</span>
            <span className="text-accent">{ABOUT_DATA.status}</span>
          </div>
        </div>

        {!compact && (
          <p className="text-sm text-text-secondary font-light leading-relaxed max-w-xl">
            {ABOUT_DATA.bio}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Project ─── */
function ProjectContent({ project, compact }: { project: ProjectData; compact: boolean }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={compact ? "p-4" : "p-8 md:p-12"}
    >
      <div className={compact ? "space-y-2.5" : "space-y-6"}>
        <div>
          <span
            className={`font-mono uppercase tracking-[0.15em] block mb-1 ${compact ? "text-[10px]" : "text-xs"}`}
            style={{ color: project.accentColor }}
          >
            {project.company}
          </span>
          <h2 className={`font-heading font-bold tracking-tight text-foreground ${compact ? "text-lg" : "text-4xl md:text-5xl"}`}>
            {project.title}
          </h2>
          <p className={`text-text-secondary font-normal ${compact ? "text-xs mt-0.5 leading-snug" : "text-sm mt-2"}`}>
            {project.tagline}
          </p>
        </div>

        <div className={`grid grid-cols-2 gap-2 font-mono uppercase tracking-wider ${compact ? "text-[10px]" : "text-xs"}`}>
          <div>
            <span className="text-text-tertiary block">Role</span>
            <span className="text-foreground">{project.role}</span>
          </div>
          <div>
            <span className="text-text-tertiary block">Timeline</span>
            <span className="text-foreground">{project.timeline}</span>
          </div>
        </div>

        <div className={compact ? "space-y-1.5" : "space-y-3"}>
          {project.highlights.map((h, i) => (
            <div
              key={i}
              className={`rounded-md border border-white/[0.06] ${compact ? "p-2" : "p-4"}`}
              style={{ backgroundColor: `${project.accentBg}88` }}
            >
              <p className={`text-text-secondary font-normal leading-relaxed ${compact ? "text-xs" : "text-xs"}`}>
                {h}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Experience ─── */
function ExperienceContent({ compact }: { compact: boolean }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={compact ? "p-4" : "p-8 md:p-12"}
    >
      <div className={compact ? "space-y-3" : "space-y-6"}>
        <div>
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.15em] block mb-1">
            Career
          </span>
          <h2 className={`font-heading font-bold tracking-tight text-foreground ${compact ? "text-lg" : "text-3xl"}`}>
            Experience
          </h2>
        </div>

        <div className={compact ? "space-y-2.5" : "space-y-5"}>
          {EXPERIENCE.map((exp) => (
            <div key={exp.company} className={`border-l-2 border-accent/30 ${compact ? "pl-2.5" : "pl-4"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-heading font-medium text-foreground ${compact ? "text-xs" : "text-sm"}`}>
                    {exp.title}
                  </h3>
                  <span className={`font-mono text-text-secondary ${compact ? "text-[10px]" : "text-xs"}`}>
                    {exp.company} · {exp.location}
                  </span>
                </div>
                <span className={`font-mono text-text-tertiary shrink-0 ${compact ? "text-[10px]" : "text-[10px]"}`}>
                  {exp.timeline}
                </span>
              </div>
              {!compact && (
                <ul className="mt-2 space-y-1">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="text-xs text-text-secondary font-light leading-relaxed flex gap-2">
                      <span className="text-accent/50 shrink-0">·</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skills ─── */
function SkillsContent({ compact }: { compact: boolean }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={compact ? "p-4" : "p-8 md:p-12"}
    >
      <div className={compact ? "space-y-3" : "space-y-6"}>
        <div>
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.15em] block mb-1">
            Toolkit
          </span>
          <h2 className={`font-heading font-bold tracking-tight text-foreground ${compact ? "text-lg" : "text-3xl"}`}>
            Skills
          </h2>
        </div>

        <div className={`flex flex-wrap ${compact ? "gap-1" : "gap-2"}`}>
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className={`rounded-md border border-white/[0.06] bg-white/[0.03] font-mono text-text-secondary ${
                compact ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1.5"
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Philosophy ─── */
function PhilosophyContent({ compact }: { compact: boolean }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={compact ? "p-4" : "p-8 md:p-12"}
    >
      <div className={compact ? "space-y-3" : "space-y-6"}>
        <div>
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.15em] block mb-1">
            Principles
          </span>
          <h2 className={`font-heading font-bold tracking-tight text-foreground ${compact ? "text-lg" : "text-3xl"}`}>
            Design Philosophy
          </h2>
        </div>

        <div className={compact ? "space-y-2" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          {PHILOSOPHY_ITEMS.map((item) => (
            <div key={item.title} className={`rounded-md border border-white/[0.06] bg-white/[0.02] ${compact ? "p-2.5" : "p-4"} space-y-1.5`}>
              <div className="flex items-center gap-2">
                <item.icon className={`text-accent ${compact ? "h-3 w-3" : "h-4 w-4"}`} />
                <span className={`font-heading font-medium text-foreground ${compact ? "text-[10px]" : "text-sm"}`}>
                  {item.title}
                </span>
              </div>
              <p className={`text-text-secondary font-normal leading-relaxed ${compact ? "text-xs" : "text-xs"}`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Contact ─── */
function ContactContent({ compact }: { compact: boolean }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={compact ? "p-4" : "p-8 md:p-12"}
    >
      <div className={compact ? "space-y-3" : "space-y-6"}>
        <div>
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.15em] block mb-1">
            Connect
          </span>
          <h2 className={`font-heading font-bold tracking-tight text-foreground ${compact ? "text-lg" : "text-3xl"}`}>
            Get in Touch
          </h2>
        </div>

        <div className={compact ? "space-y-2" : "space-y-3"}>
          <a
            href={`mailto:${CONTACT_DATA.email}`}
            className={`flex items-center gap-2 text-text-secondary hover:text-accent transition-colors group ${compact ? "text-[9px]" : "text-sm"}`}
          >
            <Mail className={`text-text-tertiary group-hover:text-accent transition-colors ${compact ? "h-3 w-3" : "h-4 w-4"}`} />
            <span className="font-mono">{CONTACT_DATA.email}</span>
          </a>
          <a
            href={CONTACT_DATA.behance}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-text-secondary hover:text-accent transition-colors group ${compact ? "text-[9px]" : "text-sm"}`}
          >
            <Link className={`text-text-tertiary group-hover:text-accent transition-colors ${compact ? "h-3 w-3" : "h-4 w-4"}`} />
            <span className="font-mono">behance.net/hammadzia2</span>
          </a>
          <a
            href={`tel:${CONTACT_DATA.phone}`}
            className={`flex items-center gap-2 text-text-secondary hover:text-accent transition-colors group ${compact ? "text-[9px]" : "text-sm"}`}
          >
            <Briefcase className={`text-text-tertiary group-hover:text-accent transition-colors ${compact ? "h-3 w-3" : "h-4 w-4"}`} />
            <span className="font-mono">{CONTACT_DATA.phone}</span>
          </a>
        </div>

        {!compact && (
          <p className="text-sm text-text-secondary font-light leading-relaxed mt-4 max-w-md">
            {CONTACT_DATA.closingLine}
          </p>
        )}
      </div>
    </motion.div>
  );
}
