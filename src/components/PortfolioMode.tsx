"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Check,
  Copy
} from "lucide-react";
import {
  PROJECTS,
  EXPERIENCE,
  ABOUT_DATA,
  CONTACT_DATA,
} from "./ArtboardContent";
import SplitText from "./SplitText";

interface PortfolioModeProps {
  onSwitchMode: () => void;
}

// Custom Scroll-Reveal Wrapper using Framer Motion
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

export default function PortfolioMode({ onSwitchMode }: PortfolioModeProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeGlow, setActiveGlow] = useState<Record<string, { x: number; y: number; active: boolean }>>({});
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMouseMove = (e: React.MouseEvent<any>, name: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setActiveGlow((prev) => ({
      ...prev,
      [name]: { x, y, active: true },
    }));
  };

  const handleMouseLeave = (name: string) => {
    setActiveGlow((prev) => ({
      ...prev,
      [name]: { x: 0, y: 0, active: false },
    }));
  };
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 80) {
        setNavVisible(true);
      } else if (currentY < lastScrollY.current) {
        setNavVisible(true);
      } else {
        setNavVisible(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleProjectMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveProjectId(id);
    }, 120);
  };

  const handleProjectMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveProjectId(null);
    }, 100);
  };

  const projectMetrics: Record<string, { value: string; label: string }> = {
    "ai-fiesta": { value: "4 AI", label: "MODELS INTEGRATED IN ONE UNIFIED CHAT EXPERIENCE" },
    "tagmango": { value: "Creator", label: "MONETIZATION SPRINT FOR 10K+ CREATORS" },
    "asseteye": { value: "+41%", label: "TASK SUCCESS SPEEDUP FOR ENTERPRISE USERS" },
    "nuros-ai": { value: "-60%", label: "REDUCTION IN USER INTERFACE LEARNING CURVE" },
    "posture-pal": { value: "10k+", label: "ACTIVE MOBILE APPLICATION DOWNLOADS" },
    "framix": { value: "+40%", label: "DESIGN SPEEDUP VIA FIGMA COMPONENT LIBRARY" }
  };

  const processSteps = [
    {
      num: "01",
      title: "Discovery",
      duration: "3-5 days",
      points: [
        "Initial Consultation: Understand the project's vision, user goals, and constraints.",
        "UX Audit & Competitor Research: Analyze industry trends to extract design insights.",
        "Scope Definition: Establish deliverables, architecture schemas, and key timelines.",
      ]
    },
    {
      num: "02",
      title: "Design",
      duration: "1-2 weeks",
      points: [
        "Wireframing: Create low-fidelity layouts to map visual hierarchies and data states.",
        "Design Tokens & Systems: Formulate clean color typography and shared libraries.",
        "Interactive Prototyping: Build high-fidelity Figma components for validation.",
      ]
    },
    {
      num: "03",
      title: "Build",
      duration: "2-3 weeks",
      points: [
        "Component Construction: Build out responsive systems using Next.js/Tailwind.",
        "Clean Integration: Format details, content nodes, and visual mockup assets.",
        "Accessibility Validation: Optimize responsive layouts for full WCAG compliance.",
      ]
    },
    {
      num: "04",
      title: "Launch",
      duration: "1 week",
      points: [
        "Usability Review: Validate interactive states through QA testing flows.",
        "Feedback Iterations: Polish transitions, margin alignment, and loader triggers.",
        "System Hand-off: Deploy optimized static builds ready for search indexing.",
      ]
    }
  ];

  const tools = [
    {
      name: "Figma",
      proficiency: 99,
      description: "Design systems, prototyping & collaboration",
      color: "linear-gradient(90deg, #A259FF, #FF7262)",
      glowColor: "242, 78, 30",
      iconSvg: (
        <svg viewBox="0 0 12 18" className="h-8 w-auto select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6a3 3 0 1 1 0-6h3v6H3Z" fill="#F24E1E"/>
          <path d="M3 12a3 3 0 1 1 0-6h3v6H3Z" fill="#A259FF"/>
          <path d="M3 18a3 3 0 1 1 3-3v3H3Z" fill="#0ACF83"/>
          <circle cx="9" cy="3" r="3" fill="#1ABCFE"/>
          <circle cx="9" cy="9" r="3" fill="#FF7262"/>
        </svg>
      )
    },
    {
      name: "Framer",
      proficiency: 98,
      description: "Web experiences, interactions & rapid builds",
      color: "linear-gradient(90deg, #0055FF, #33ccff)",
      glowColor: "0, 85, 255",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-white select-none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
        </svg>
      )
    },
    {
      name: "Cursor",
      proficiency: 90,
      description: "AI-powered code editor for faster development",
      color: "linear-gradient(90deg, #10B981, #34D399)",
      glowColor: "16, 185, 129",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-7.5 h-7.5 select-none" fill="currentColor" fillRule="evenodd" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z" />
        </svg>
      )
    },
    {
      name: "React",
      proficiency: 89,
      description: "Building scalable user interfaces",
      color: "linear-gradient(90deg, #61DAFB, #00bcff)",
      glowColor: "97, 218, 251",
      iconSvg: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-8 h-8 select-none" fill="none" stroke="#61DAFB" strokeWidth="1.2" xmlns="http://www.w3.org/2000/svg">
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
          <g stroke="#61DAFB">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      )
    },
    {
      name: "Next.js",
      proficiency: 86,
      description: "Production-ready React applications",
      color: "linear-gradient(90deg, #ffffff, #888888)",
      glowColor: "255, 255, 255",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 select-none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
        </svg>
      )
    },
    {
      name: "Tailwind CSS",
      proficiency: 80,
      description: "Utility-first CSS for modern UI",
      color: "linear-gradient(90deg, #06B6D4, #38BDF8)",
      glowColor: "6, 182, 212",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 select-none" fill="#38BDF8" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 14.881 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 15.121 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 8.881 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 9.121 12 6.001 12z" />
        </svg>
      )
    },
    {
      name: "TypeScript",
      proficiency: 85,
      description: "Type-safe JavaScript development",
      color: "linear-gradient(90deg, #3178C6, #60a5fa)",
      glowColor: "49, 120, 198",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-7.5 h-7.5 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="3" fill="#3178C6" />
          <path d="M18.488 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" fill="white" />
        </svg>
      )
    },
    {
      name: "ChatGPT",
      proficiency: 99,
      description: "Research, ideation & content acceleration",
      color: "linear-gradient(90deg, #10A37F, #34D399)",
      glowColor: "16, 163, 127",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 select-none" fill="currentColor" fillRule="evenodd" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v-3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
        </svg>
      )
    },
    {
      name: "Claude",
      proficiency: 95,
      description: "AI assistant for complex thinking & writing",
      color: "linear-gradient(90deg, #D97706, #fb923c)",
      glowColor: "217, 119, 6",
      iconSvg: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 select-none" fill="currentColor" fillRule="evenodd" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 0 1-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
        </svg>
      )
    }
  ];

  const testimonials = [
    {
      rating: "5.0",
      quote: "Hammad transformed our complex dashboard idea into a stunning interface in just two weeks, and we couldn't be happier! His attention to detail was exceptional.",
      author: "Product Lead at Fleapo",
    },
    {
      rating: "4.8",
      quote: "Attention to detail is evident in the responsive layouts Hammad engineered, ensuring seamless performance across enterprise mobile viewports.",
      author: "Growth Loops Director",
    },
    {
      rating: "5.0",
      quote: "The Framix design library Hammad built eliminated inconsistencies and slashed our development iteration cycles by 40%. Highly recommended!",
      author: "PurpleMerit Frontend Architect",
    }
  ];

  const faqs = [
    {
      q: "What is your typical project timeline?",
      a: "A typical project timeline ranges from 2 to 4 weeks, depending on the complexity of the product, design system components, and scope of user research. I provide detailed weekly sprints to keep development aligned."
    },
    {
      q: "Do you offer ongoing design audits?",
      a: "Yes, I offer ongoing design audits and maintenance plans to refine interfaces, test newly shipped user flows, and optimize conversion funnels as your SaaS platform scales."
    },
    {
      q: "Can you work with existing brand systems?",
      a: "Absolutely! I am experienced in adapting to existing brand guidelines, scaling them into modular Figma component libraries, and translating them into developer-ready code."
    },
    {
      q: "How do you handle client revisions?",
      a: "I work in highly collaborative cycles with structured feedback loops. Every design phase features high-fidelity clickable prototype reviews to ensure layout validation before development starts."
    }
  ];

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(CONTACT_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  // Motion variants for stagger fade-ins
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white/80 relative overflow-x-hidden font-body selection:bg-white selection:text-black">
      
      {/* ─── Sticky Airy Header ─── */}
      <header
        className="fixed top-0 w-full z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/[0.06] transition-transform duration-300"
        style={{ transform: (navVisible || mobileMenuOpen) ? "translateY(0)" : "translateY(-100%)" }}
      >
        <div className="max-w-[1320px] mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-heading text-base md:text-lg font-semibold text-white tracking-widest uppercase select-none">
              hammad.design
            </span>
          </div>

          <div className="flex items-center gap-5">
            <nav className="hidden md:flex items-center gap-8 font-heading text-sm text-white/80 tracking-wide uppercase font-medium">
              <a href="#work" className="hover:text-white transition-colors duration-200 relative group font-medium">
                Work
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#skills" className="hover:text-white transition-colors duration-200 relative group font-medium">
                Toolkit
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#process" className="hover:text-white transition-colors duration-200 relative group font-medium">
                Process
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#contact" className="hover:text-white transition-colors duration-200 relative group font-medium">
                Contact
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </a>
              {/* Games tab */}
              <a
                href="/games"
                className="relative flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors duration-200 group cursor-pointer select-none font-medium"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4m-2-2v4"/><circle cx="17" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1" fill="currentColor" stroke="none"/>
                </svg>
                Games
                <span className="inline-flex items-center bg-violet-500/20 text-violet-300 font-heading text-[7px] uppercase tracking-wider rounded-full px-1.5 py-0.5 leading-none border border-violet-500/30 select-none">
                  Fun
                </span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
              </a>
            </nav>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-white/[0.08]" />

            {/* View Resume CTA */}
            <a
              href={CONTACT_DATA.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 bg-white text-black font-semibold font-heading text-[10px] uppercase tracking-widest rounded-full px-4 py-2 hover:bg-white/90 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] transition-all duration-200 select-none group"
            >
              <svg className="w-3 h-3 shrink-0 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              Resume
            </a>
            
            <button
              onClick={onSwitchMode}
              className="hidden md:block relative group cursor-pointer select-none"
            >
              {/* Outer glow ring */}
              <span className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400 opacity-70 group-hover:opacity-100 blur-[3px] transition-opacity duration-300" />
              {/* Button body */}
              <span className="relative flex items-center gap-2 bg-[#0a0a0c] rounded-full px-4 py-2 border border-white/10 group-hover:border-white/0 transition-all duration-300">
                {/* Figma-style F icon */}
                <svg width="13" height="13" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <path d="M3 9C3 7.343 4.343 6 6 6H9V12H6C4.343 12 3 10.657 3 9Z" fill="#A78BFA"/>
                  <path d="M3 3C3 1.343 4.343 0 6 0H9V6H6C4.343 6 3 4.657 3 3Z" fill="#F472B6"/>
                  <path d="M9 0H12C13.657 0 15 1.343 15 3C15 4.657 13.657 6 12 6H9V0Z" fill="#60A5FA"/>
                  <path d="M3 15C3 13.343 4.343 12 6 12C7.657 12 9 13.343 9 15C9 16.657 7.657 18 6 18C4.343 18 3 16.657 3 15Z" fill="#34D399"/>
                  <path d="M9 6H12C13.657 6 15 7.343 15 9C15 10.657 13.657 12 12 12H9V6Z" fill="#F59E0B"/>
                </svg>
                <span className="font-heading text-[10px] uppercase tracking-widest text-white/70 group-hover:text-white transition-colors duration-200">
                  Design File
                </span>
                {/* New badge */}
                <span className="flex items-center justify-center bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-heading text-[8px] uppercase tracking-wider rounded-full px-1.5 py-0.5 leading-none select-none">
                  New
                </span>
              </span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-50 relative focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-px bg-white block rounded-full"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="w-5 h-px bg-white block rounded-full"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-px bg-white block rounded-full"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-35 bg-[#0a0a0c]/98 backdrop-blur-xl md:hidden pt-28 px-6 flex flex-col justify-between pb-12"
          >
            <nav className="flex flex-col gap-6 text-left font-heading text-3xl font-light tracking-tight text-white/80">
              <a
                href="#work"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white transition-colors duration-200"
              >
                Work
              </a>
              <a
                href="#skills"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white transition-colors duration-200"
              >
                Toolkit
              </a>
              <a
                href="#process"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white transition-colors duration-200"
              >
                Process
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white transition-colors duration-200"
              >
                Contact
              </a>
              <a
                href="/games"
                onClick={() => setMobileMenuOpen(false)}
                className="text-violet-400 hover:text-violet-300 transition-colors duration-200 flex items-center gap-2"
              >
                Games
                <span className="bg-violet-500/20 text-violet-300 font-mono text-[8px] uppercase tracking-wider rounded-full px-2 py-0.5 border border-violet-500/30">
                  Fun
                </span>
              </a>
            </nav>

            <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-8">
              <a
                href={CONTACT_DATA.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-white text-black font-semibold font-heading text-xs uppercase tracking-widest rounded-full py-4 hover:bg-white/90 transition-all duration-200"
              >
                Resume
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSwitchMode();
                }}
                className="w-full text-center border border-white/10 hover:border-white/20 bg-white/[0.02] text-white/80 font-semibold font-heading text-xs uppercase tracking-widest rounded-full py-4 transition-all duration-200"
              >
                Design File
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hero Section ─── */}
      <section className="max-w-[1320px] mx-auto px-6 pt-28 pb-16 md:pt-36 md:pb-24 relative z-10 text-left">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left side: Hero Typography & Info */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Availability badge */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="inline-flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.08] rounded-full px-4 py-2 select-none">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                    Available for new projects
                  </span>
                </div>
              </motion.div>


              {/* Main headline */}
              <h1
                className="font-heading font-light text-white leading-[1.06] tracking-tight mb-8"
                style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)" }}
              >
                <span className="block lg:inline-block lg:whitespace-nowrap">
                  <SplitText
                    text="Design systems"
                    tag="span"
                    className="inline-block"
                    delay={35}
                    duration={0.7}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 30 }}
                    to={{ opacity: 1, y: 0 }}
                    textAlign="left"
                  />
                </span>
                <br />
                <span className="block lg:inline-block lg:whitespace-nowrap">
                  <SplitText
                    text="that "
                    tag="span"
                    className="inline-block"
                    delay={35}
                    duration={0.7}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 30 }}
                    to={{ opacity: 1, y: 0 }}
                    textAlign="left"
                  />
                  <SplitText
                    text="scale."
                    tag="span"
                    className="relative inline-block animate-pulse-glow"
                    style={{
                      background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                    delay={35}
                    duration={0.7}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 30 }}
                    to={{ opacity: 1, y: 0 }}
                    textAlign="left"
                  />
                </span>
                <br />
                <span className="text-white/55 font-extralight block lg:inline-block lg:whitespace-nowrap">
                  <SplitText
                    text="Interfaces that convert."
                    tag="span"
                    className="inline-block"
                    delay={25}
                    duration={0.7}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 30 }}
                    to={{ opacity: 1, y: 0 }}
                    textAlign="left"
                  />
                </span>
              </h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-white/45 text-base md:text-lg font-light leading-relaxed max-w-2xl mb-10"
              >
                I'm <span className="text-white/85 font-normal">Hammad Zia</span> - a product designer based in Kolkata, currently at{" "}
                <span className="text-white/85 font-normal">Fleapo</span>. I reduce complexity, build modular Figma systems, and deliver developer-ready interfaces for SaaS products.
              </motion.p>


              {/* CTA row */}
              <motion.div variants={itemVariants} className="flex items-center gap-5">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2.5 bg-white text-black font-heading text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-full hover:bg-white/90 transition-all duration-200 font-semibold select-none"
                >
                  Start a project
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/[0.02] text-white/80 hover:text-white font-heading text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-full transition-all duration-200 select-none group"
                >
                  View work
                  <span className="text-white/30 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </a>
              </motion.div>
            </div>

            {/* Right side: Portrait Frame & KPIs */}
            <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center gap-6 w-full">
              {/* Radial gradient background aura */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-violet-500/10 via-indigo-500/5 to-transparent opacity-75 blur-3xl pointer-events-none" />

              <motion.div
                variants={itemVariants}
                className="relative w-full max-w-[430px] aspect-[4/5] rounded-[32px] overflow-hidden border border-white/[0.08] bg-[#0f0f13] shadow-[0_25px_60px_rgba(0,0,0,0.6)] group select-none cursor-pointer"
              >
                {/* Background Ambient Glow inside the border hover */}
                <div className="absolute -inset-[1px] rounded-[32px] bg-gradient-to-tr from-violet-500/20 via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

                {/* Outer border glow on hover */}
                <div className="absolute inset-0 rounded-[32px] border border-violet-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none" />

                {/* The Portrait Image */}
                <img
                  src="/hammad.png"
                  alt="Hammad Zia Portrait"
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-103 transition-all duration-700 ease-out z-10"
                />

              </motion.div>

              {/* KPIs Row */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-4 w-full max-w-[430px]"
              >
                {[
                  { value: "3+", label: "Years of\nExperience", accent: "from-violet-500 to-indigo-500" },
                  { value: "16+", label: "Products\nDelivered", accent: "from-indigo-500 to-sky-500" },
                  { value: "95%", label: "Client\nSatisfaction", accent: "from-sky-500 to-emerald-500" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="relative flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl py-5 px-3 select-none transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:border-white/[0.12] group/kpi overflow-hidden"
                  >
                    {/* Hover Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover/kpi:opacity-100 transition-opacity duration-500" />
                    
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r ${stat.accent} opacity-0 group-hover/kpi:opacity-100 transition-opacity duration-300`} />

                    <span className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-none mb-2 transition-transform duration-300 group-hover/kpi:scale-105 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 group-hover/kpi:text-white/50 transition-colors duration-300 leading-normal whitespace-pre-line">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex items-center gap-3.5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 select-none"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="w-4 h-6 rounded-full border border-white/15 flex items-start justify-center p-1 shrink-0"
            >
              <div className="w-0.5 h-1.5 rounded-full bg-white/30" />
            </motion.div>
            <span>Scroll to explore</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Infinite Marquee Role Tickers (The Strips) ─── */}
      <section className="w-full overflow-hidden py-10 border-y border-white/[0.04] bg-[#0c0c0e]/30 relative z-10 select-none">
        <div className="flex overflow-hidden w-full">
          <div className="animate-marquee whitespace-nowrap flex gap-12 text-[32px] md:text-[44px] font-heading font-black uppercase tracking-wider">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-12 items-center">
                <span className="text-transparent stroke-text">Product Designer</span>
                <span className="text-white/20">·</span>
                <span className="text-white/35">CX Designer</span>
                <span className="text-white/20">·</span>
                <span className="text-transparent stroke-text">AI Generalist</span>
                <span className="text-white/20">·</span>
                <span className="text-white/35">Entrepreneur</span>
                <span className="text-white/20">·</span>
                <span className="text-transparent stroke-text">AI Developer</span>
                <span className="text-white/20">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ Case Study Index Section â”€â”€â”€ */}
      <section id="work" className="max-w-[1320px] mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="space-y-20">

          {/* Section Header */}
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-bold text-white/40 uppercase tracking-[0.25em] select-none block">
                  case study archive
                </span>
                <h2 className="font-heading text-5xl sm:text-6xl font-light text-white tracking-tight leading-[1.08] max-w-lg">
                  Selected work.
                </h2>
              </div>
              <p className="text-white/40 text-sm font-light leading-relaxed font-body max-w-xs lg:text-right">
                {PROJECTS.length} projects · UI/UX Design & Product Design
              </p>
            </div>
          </ScrollReveal>

          {/* Project Rows */}
          <div className="space-y-0">
            {PROJECTS.map((project, index) => {
              const isOpen = activeProjectId === project.id;
              const metric = projectMetrics[project.id] || { value: "", label: "" };
              
              return (
                <ScrollReveal key={project.id} delay={index * 0.04}>
                  <div
                    onMouseEnter={() => handleProjectMouseEnter(project.id)}
                    onMouseLeave={handleProjectMouseLeave}
                    className={`border-t border-white/[0.06] transition-all duration-500 ${isOpen ? "border-white/[0.12]" : ""}`}
                  >
                    {/* Main clickable row */}
                    <button
                      onClick={() => setActiveProjectId(isOpen ? null : project.id)}
                      className="w-full text-left py-8 lg:py-10 flex items-center gap-5 lg:gap-8 group cursor-pointer select-none"
                    >
                      {/* Index number */}
                      <span className={`font-mono text-xs tabular-nums shrink-0 w-6 transition-colors duration-300 ${isOpen ? "text-white/50" : "text-white/20 group-hover:text-white/35"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Logo - rounded square */}
                      <div className="shrink-0">
                        {project.id === "ai-fiesta" ? (
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                            <img src="/ai-fiesta.png" alt="AI Fiesta" className="w-full h-full object-cover" />
                          </div>
                        ) : project.id === "tagmango" ? (
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 bg-white flex items-center justify-center">
                            <img src="/unnamed.png" alt="TagMango logo" className="w-full h-full object-contain" />
                          </div>
                        ) : project.id === "asseteye" ? (
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] flex items-center justify-center p-0.5">
                            <svg viewBox="0 0 100 100" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <linearGradient id="asseteye-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#0b1a14" />
                                  <stop offset="100%" stopColor="#1e3a2f" />
                                </linearGradient>
                              </defs>
                              <circle cx="50" cy="50" r="50" fill="url(#asseteye-grad)" />
                              <g fill="none" stroke="#76BA43" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="50" cy="50" r="32" strokeWidth="4" />
                                <path d="M50 18 L34 35" /><path d="M77.7 34 L62 18" />
                                <path d="M77.7 66 L77.7 46" /><path d="M50 82 L66 65" />
                                <path d="M22.3 66 L38 82" /><path d="M22.3 34 L22.3 54" />
                                <polygon points="50,38 60.4,44 60.4,56 50,62 39.6,56 39.6,44" fill="#0b1a14" />
                              </g>
                            </svg>
                          </div>
                        ) : project.id === "nuros-ai" ? (
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 bg-white flex items-center justify-center">
                            <img src="/Frame 2087327899.png" alt="Nuros AI logo" className="w-full h-full object-contain" />
                          </div>
                        ) : project.id === "posture-pal" ? (
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] flex items-center justify-center p-0.5">
                            <svg viewBox="0 0 100 100" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <linearGradient id="posture-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#1a0a14" /><stop offset="100%" stopColor="#db2777" />
                                </linearGradient>
                              </defs>
                              <circle cx="50" cy="50" r="50" fill="url(#posture-grad)" />
                              <g fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                                <circle cx="50" cy="24" r="5" fill="white" stroke="none" />
                                <path d="M50 34 Q45 42 50 50" /><path d="M50 50 Q55 58 50 66" />
                                <path d="M50 66 Q45 72 50 78" />
                                <path d="M28 45 A25 25 0 0 1 72 45" stroke="#f472b6" strokeWidth="2" strokeDasharray="4,4" />
                                <path d="M28 55 A25 25 0 0 0 72 55" stroke="#f472b6" strokeWidth="2" strokeDasharray="4,4" />
                              </g>
                            </svg>
                          </div>
                        ) : project.id === "framix" ? (
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] flex items-center justify-center p-0.5">
                            <svg viewBox="0 0 100 100" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <linearGradient id="framix-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#15102a" /><stop offset="100%" stopColor="#7c3aed" />
                                </linearGradient>
                              </defs>
                              <circle cx="50" cy="50" r="50" fill="url(#framix-grad)" />
                              <g fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
                                <rect x="25" y="25" width="50" height="50" rx="6" strokeWidth="3" />
                                <line x1="25" y1="42" x2="75" y2="42" strokeWidth="2" strokeDasharray="1,2" />
                                <rect x="33" y="50" width="14" height="14" rx="2" stroke="#a78bfa" strokeWidth="2.5" />
                                <line x1="54" y1="53" x2="67" y2="53" strokeWidth="2" />
                                <line x1="54" y1="61" x2="63" y2="61" strokeWidth="2" />
                              </g>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center font-mono text-xs font-bold text-white/30">
                            {project.title.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Title + role tag */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                        <h3 className={`font-heading text-2xl sm:text-3xl lg:text-4xl tracking-tight transition-all duration-300 ${isOpen ? "text-white font-normal" : "text-white/65 font-light group-hover:text-white"}`}>
                          {project.title}
                        </h3>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-white/25 border border-white/[0.07] rounded-full px-2.5 py-1 select-none shrink-0 self-start sm:self-auto">
                          {project.role}
                        </span>
                      </div>

                      {/* Right: timeline + expand icon */}
                      <div className="shrink-0 flex items-center gap-4">
                        <span className="hidden md:block font-mono text-xs text-white/20 select-none">{project.timeline}</span>
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? "border-white/30 bg-white/10 rotate-45" : "border-white/10 group-hover:border-white/25"}`}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <line x1="6" y1="1" x2="6" y2="11" stroke="white" strokeOpacity={isOpen ? "0.7" : "0.3"} strokeWidth="1.5" strokeLinecap="round"/>
                            <line x1="1" y1="6" x2="11" y2="6" stroke="white" strokeOpacity={isOpen ? "0.7" : "0.3"} strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Expand Panel */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-12 space-y-10 border-t border-white/[0.04] pt-8 pl-0 lg:pl-24">

                            {/* Brief + Metric */}
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
                              <div className="space-y-3 max-w-2xl">
                                <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest block select-none">Project Brief</span>
                                <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed font-body">
                                  {project.tagline}
                                </p>
                              </div>
                              {metric.value && (
                                <div className="shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 min-w-[160px] text-center">
                                  <span className="font-mono text-[9px] text-[#8cff2e] uppercase tracking-widest font-semibold block mb-2 select-none">Key Highlight</span>
                                  <div className="font-heading text-4xl font-black text-white tracking-tight leading-none select-none">{metric.value}</div>
                                  <p className="font-mono text-[9px] tracking-widest uppercase text-white/35 mt-2 select-none">{metric.label}</p>
                                </div>
                              )}
                            </div>

                            {/* Deliverables */}
                            <div className="space-y-4 border-t border-white/[0.04] pt-8">
                              <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest block select-none">Core Deliverables</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
                                {project.highlights.map((hl, hlIdx) => (
                                  <div key={hlIdx} className="flex items-start gap-3">
                                    <div className="w-1 h-1 rounded-full bg-white/30 mt-2.5 shrink-0" />
                                    <p className="text-white/55 text-sm font-light leading-relaxed font-body">{hl}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Metadata Footer */}
                            <div className="flex flex-wrap gap-x-8 gap-y-2 pt-6 border-t border-white/[0.04] font-mono text-[10px] uppercase tracking-widest text-white/30">
                              <span>Role <strong className="text-white/65 font-semibold ml-2">{project.role}</strong></span>
                              <span>Client <strong className="text-white/65 font-semibold ml-2">{project.company}</strong></span>
                              <span>Timeline <strong className="text-white/65 font-semibold ml-2">{project.timeline}</strong></span>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollReveal>
              );
            })}
            <div className="border-t border-white/[0.06]" />
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ Skills & Toolkit Section â”€â”€â”€ */}
      <section id="skills" className="max-w-[1320px] mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="space-y-16">
          
          {/* Header on top */}
          <ScrollReveal>
            <div className="text-left border-b border-white/[0.04] pb-4">
              <h2 className="font-mono text-xs font-bold text-white/40 uppercase tracking-[0.25em] select-none">
                tools & technologies
              </h2>
            </div>
          </ScrollReveal>

          {/* Heading + Description Row */}
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16 items-start">
              <h3 className="font-heading text-4xl sm:text-5xl font-light text-white tracking-tight leading-[1.12]">
                Tools I use to design, build and ship digital products.
              </h3>
              <div className="space-y-6">
                <p className="text-white/50 text-base md:text-lg font-light leading-relaxed font-body">
                  A curated toolkit that helps me move from ideas to impactful experiences with speed and precision.
                </p>

              </div>
            </div>
          </ScrollReveal>

          {/* 3-column Grid of Premium Cards */}
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const coords = activeGlow[tool.name] || { x: 0, y: 0, active: false };
                const inlineStyle = {
                  "--glow-x": `${coords.x}px`,
                  "--glow-y": `${coords.y}px`,
                  "--glow-intensity": coords.active ? 1 : 0,
                  "--glow-color": tool.glowColor,
                } as React.CSSProperties;

                return (
                  <div 
                    key={tool.name}
                    onMouseMove={(e) => handleMouseMove(e, tool.name)}
                    onMouseLeave={() => handleMouseLeave(tool.name)}
                    style={inlineStyle}
                    className={`bg-[#0e0e11] border border-white/[0.04] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:bg-[#111114] group card--border-glow bento-section relative overflow-hidden ${
                      tool.name === "Claude" ? "sm:col-span-2 lg:col-span-1" : ""
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon & Proficiency */}
                      <div className="flex justify-between items-center">
                        <div className="text-white shrink-0 w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/[0.08] rounded-2xl p-2.5 group-hover:border-white/20 transition-all duration-300 group-hover:bg-white/[0.06] group-hover:scale-[1.05]">
                          {tool.iconSvg}
                        </div>
                        <div className="text-right">
                          <span className="block font-heading text-2xl font-bold text-white leading-none">
                            {tool.proficiency}%
                          </span>
                          <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest block mt-1 select-none">
                            Proficiency
                          </span>
                        </div>
                      </div>

                      {/* Tool Name */}
                      <h3 className="font-heading text-lg font-bold text-white tracking-tight mt-6">
                        {tool.name}
                      </h3>

                      {/* Custom Color Brand Progress Bar */}
                      <div className="w-full h-[4px] rounded-full bg-white/[0.03] overflow-hidden mt-4">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ 
                            width: `${tool.proficiency}%`, 
                            background: tool.color 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/50 text-xs font-light leading-relaxed mt-6 font-body">
                      {tool.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* â”€â”€â”€ Process Timeline Section â”€â”€â”€ */}
      <section id="process" className="max-w-[1320px] mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="space-y-16">
          
          {/* Header on top */}
          <ScrollReveal>
            <div className="text-left border-b border-white/[0.04] pb-4">
              <h2 className="font-mono text-xs font-bold text-white/40 uppercase tracking-[0.25em] select-none">
                design sprints
              </h2>
            </div>
          </ScrollReveal>

          {/* Heading + Description Row */}
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16 items-start">
              <h3 className="font-heading text-4xl sm:text-5xl font-light text-white tracking-tight leading-[1.12]">
                A structured methodology to design, validate, and ship products.
              </h3>
              <p className="text-white/50 text-base md:text-lg font-light leading-relaxed font-body">
                How I structure timelines to maintain alignment, validate visual states, and guarantee high retention rates.
              </p>
            </div>
          </ScrollReveal>

          {/* Spacious Horizontal Roadmap */}
          <div className="space-y-0 mt-8 text-left">
            {processSteps.map((step, idx) => (
              <ScrollReveal key={step.title} delay={idx * 0.05}>
                <div
                  className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-16 border-t border-white/[0.06] py-10 group cursor-default transition-all duration-300 hover:bg-white/[0.02] hover:pl-4 rounded-lg"
                >
                  {/* Left Column: Phase title + duration only */}
                  <div className="flex flex-col justify-center space-y-2">
                    <h4 className="font-heading text-3xl font-light text-white tracking-tight leading-tight group-hover:text-white transition-colors duration-300">
                      {step.title}
                    </h4>
                    <span className="font-mono text-[10px] text-white/35 tracking-wider uppercase select-none">
                      {step.duration}
                    </span>
                  </div>

                  {/* Right Column: 3 deliverables side-by-side */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                    {step.points.map((pt, pIdx) => {
                      const hasColon = pt.includes(":");
                      let title = "";
                      let desc = pt;
                      if (hasColon) {
                        const colonIdx = pt.indexOf(":");
                        title = pt.substring(0, colonIdx);
                        desc = pt.substring(colonIdx + 1).trim();
                      }

                      return (
                        <div key={pIdx} className="space-y-2 font-body text-left">
                          {hasColon ? (
                            <>
                              <h5 className="text-white/90 text-sm font-semibold leading-snug group-hover:text-white transition-colors duration-300">
                                {title}
                              </h5>
                              <p className="text-white/50 text-sm font-light leading-relaxed">
                                {desc}
                              </p>
                            </>
                          ) : (
                            <p className="text-white/65 text-sm font-light leading-relaxed">
                              {pt}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="max-w-[1320px] mx-auto px-6 py-24 border-t border-white/[0.04] relative overflow-hidden">
        {/* Subtle background glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-violet-600/[0.06] blur-[100px]" />
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-sky-600/[0.06] blur-[100px]" />
        </div>

        <div className="relative z-10 space-y-16">
          {/* Section Header */}
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-bold text-white/40 uppercase tracking-[0.25em] select-none block">
                  client testimonials
                </span>
                <h2 className="font-heading text-5xl sm:text-6xl font-light text-white tracking-tight leading-[1.08] max-w-lg">
                  Trusted by founders.
                </h2>
              </div>
              <p className="text-white/40 text-sm font-light leading-relaxed font-body max-w-xs lg:text-right">
                Real words from real clients who shipped real products together.
              </p>
            </div>
          </ScrollReveal>

          {/* Premium Testimonial Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((test, index) => (
              <ScrollReveal key={index} delay={index * 0.08}>
                <div
                  className="relative group h-full flex flex-col justify-between rounded-3xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all duration-500 overflow-hidden p-8 lg:p-10"
                  style={{ backdropFilter: "blur(12px)" }}
                >
                  {/* Gradient corner accent on hover */}
                  <div
                    className="pointer-events-none absolute top-0 right-0 w-48 h-48 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(circle at top right, rgba(139,92,246,0.18) 0%, transparent 65%)" }}
                  />

                  {/* Top: star rating + verified pill */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <svg key={si} className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M8 1l1.854 4.146L14 5.764l-3 2.857.708 4.014L8 10.5l-3.708 2.135L5 8.621 2 5.764l4.146-.618L8 1z"
                            fill={si < Math.round(parseFloat(test.rating)) ? "#a78bfa" : "rgba(255,255,255,0.1)"}
                          />
                        </svg>
                      ))}
                      <span className="font-mono text-[10px] text-white/40 ml-1.5 tracking-wider">{test.rating}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-emerald-400/80 border border-emerald-400/20 rounded-full px-2.5 py-1 bg-emerald-400/[0.05] select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Verified
                    </span>
                  </div>

                  {/* Giant decorative quote mark */}
                  <div
                    className="absolute top-4 right-7 font-heading text-[110px] leading-none text-white/[0.03] select-none pointer-events-none font-black"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </div>

                  {/* Quote body */}
                  <blockquote className="text-white/75 group-hover:text-white/90 font-body text-base md:text-lg font-light leading-relaxed flex-1 relative z-10 transition-colors duration-300">
                    &ldquo;{test.quote}&rdquo;
                  </blockquote>

                  {/* Bottom: author */}
                  <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/25 to-sky-500/25 border border-white/[0.1] flex items-center justify-center shrink-0">
                      <span className="font-mono text-[10px] font-bold text-white/60 uppercase select-none">
                        {test.author.split(" ").filter(Boolean).map((w: string) => w[0]).slice(0, 2).join("")}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 leading-snug">{test.author}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ FAQ Section â”€â”€â”€ */}
      <section id="faq" className="max-w-[1320px] mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="space-y-20">

          {/* Header */}
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-bold text-white/40 uppercase tracking-[0.25em] select-none block">
                  frequently asked questions
                </span>
                <h2 className="font-heading text-5xl sm:text-6xl font-light text-white tracking-tight leading-[1.08] max-w-xl">
                  Questions worth asking.
                </h2>
              </div>
              <p className="text-white/45 text-base font-light leading-relaxed font-body max-w-xs lg:text-right">
                Answers to the things clients always want to know before we work together.
              </p>
            </div>
          </ScrollReveal>

          {/* FAQ Accordion */}
          <div className="space-y-0">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <ScrollReveal key={index} delay={index * 0.04}>
                  <div
                    className={`border-t border-white/[0.07] transition-all duration-500 ${
                      isOpen ? "border-white/[0.12]" : ""
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left py-8 flex items-start justify-between gap-8 group cursor-pointer select-none"
                    >
                      {/* Left: number + question */}
                      <div className="flex items-start gap-6 lg:gap-10">
                        <span
                          className={`font-mono text-xs mt-1 tabular-nums transition-colors duration-300 select-none shrink-0 ${
                            isOpen ? "text-white/60" : "text-white/20"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-heading text-xl sm:text-2xl lg:text-3xl font-light leading-snug tracking-tight transition-colors duration-300 ${
                            isOpen ? "text-white" : "text-white/75 group-hover:text-white"
                          }`}
                        >
                          {faq.q}
                        </span>
                      </div>

                      {/* Right: animated +/- icon */}
                      <div
                        className={`shrink-0 mt-1.5 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? "border-white/40 bg-white/10 rotate-45"
                            : "border-white/15 bg-transparent group-hover:border-white/30"
                        }`}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          className="transition-transform duration-300"
                        >
                          <line x1="6" y1="1" x2="6" y2="11" stroke="white" strokeOpacity={isOpen ? "0.8" : "0.4"} strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="1" y1="6" x2="11" y2="6" stroke="white" strokeOpacity={isOpen ? "0.8" : "0.4"} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </button>

                    {/* Answer */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <div className="pl-12 lg:pl-16 pb-10 pr-16">
                            {/* Gradient accent line */}
                            <div className="h-px w-12 bg-gradient-to-r from-white/40 to-transparent mb-6" />
                            <p className="text-white/60 text-base sm:text-lg leading-relaxed font-light font-body max-w-2xl">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollReveal>
              );
            })}
            {/* Final bottom border */}
            <div className="border-t border-white/[0.07]" />
          </div>

        </div>
      </section>

      {/* ─── Contact Section ─── */}
      <section id="contact" className="relative overflow-hidden border-t border-white/[0.04]">

        {/* Full-bleed ambient backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#0d0b14] to-[#0a0a0c]" />
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-[0.09]"
            style={{ background: "radial-gradient(ellipse at center, #7c3aed 0%, #2563eb 50%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[80px]"
            style={{ background: "#a78bfa" }} />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 py-28 md:py-36">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto">

              {/* Availability badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.1] rounded-full px-5 py-2.5 select-none">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/90">
                  Currently available · Taking on new projects
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-5">
                <h2
                  className="font-heading font-light text-white leading-[1.06] tracking-tight"
                  style={{ fontSize: "clamp(2.6rem, 6.5vw, 5rem)" }}
                >
                  Have an idea?{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #38bdf8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Let's ship it.
                  </span>
                </h2>
                <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto font-body">
                  I design products that convert, scale, and feel premium. Whether it's a{" "}
                  <span className="text-white/80 font-normal">SaaS dashboard</span>,{" "}
                  <span className="text-white/80 font-normal">AI interface</span>, or{" "}
                  <span className="text-white/80 font-normal">design system</span> — I'm your designer.
                </p>
              </div>

              {/* Primary + Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                {/* Primary: Email CTA */}
                <a
                  href={`mailto:${CONTACT_DATA.email}`}
                  onClick={handleCopyEmail}
                  className="group relative inline-flex items-center gap-3 bg-white text-black font-heading text-[11px] uppercase tracking-widest px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all duration-200 select-none overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-200/20 to-sky-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span className="relative">{copied ? "✓ Copied!" : `Send me an email`}</span>
                </a>

                {/* Secondary: Resume */}
                <a
                  href={CONTACT_DATA.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2.5 border border-white/10 hover:border-white/20 bg-white/[0.02] text-white/80 hover:text-white font-semibold font-heading text-[11px] uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-200 select-none"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 text-white/50 group-hover:text-white transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  View Resume
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </a>
              </div>

              {/* Social proof bar */}
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 pt-2">
                {[
                  { val: "3+", label: "Years exp." },
                  { val: "16+", label: "Products shipped" },
                  { val: "95%", label: "Client satisfaction" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 select-none">
                    <span className="font-heading text-white font-semibold text-lg leading-none">{s.val}</span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">{s.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </ScrollReveal>

          {/* Contact channel cards — premium icon tiles */}
          {(() => {
            const emailGlow = activeGlow["email"] || { x: 0, y: 0, active: false };
            const emailStyle = {
              "--glow-x": `${emailGlow.x}px`,
              "--glow-y": `${emailGlow.y}px`,
              "--glow-intensity": emailGlow.active ? 1 : 0,
              "--glow-color": "139, 92, 246",
            } as React.CSSProperties;

            const linkedinGlow = activeGlow["linkedin"] || { x: 0, y: 0, active: false };
            const linkedinStyle = {
              "--glow-x": `${linkedinGlow.x}px`,
              "--glow-y": `${linkedinGlow.y}px`,
              "--glow-intensity": linkedinGlow.active ? 1 : 0,
              "--glow-color": "14, 165, 233",
            } as React.CSSProperties;

            const behanceGlow = activeGlow["behance"] || { x: 0, y: 0, active: false };
            const behanceStyle = {
              "--glow-x": `${behanceGlow.x}px`,
              "--glow-y": `${behanceGlow.y}px`,
              "--glow-intensity": behanceGlow.active ? 1 : 0,
              "--glow-color": "99, 102, 241",
            } as React.CSSProperties;

            return (
              <ScrollReveal delay={0.15}>
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
                  {/* Email card */}
                  <a
                    href={`mailto:${CONTACT_DATA.email}`}
                    onMouseMove={(e) => handleMouseMove(e, "email")}
                    onMouseLeave={() => handleMouseLeave("email")}
                    style={emailStyle}
                    className="bg-[#0e0e11] border border-white/[0.04] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:bg-[#111114] group card--border-glow bento-section relative overflow-hidden text-left"
                  >
                    <div>
                      {/* Top Row: Icon & Arrow */}
                      <div className="flex justify-between items-start">
                        <div className="text-white shrink-0 w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 group-hover:border-violet-500/20 transition-all duration-300 group-hover:bg-violet-500/5 group-hover:scale-[1.05]">
                          <svg className="w-6 h-6 text-violet-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                          </svg>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg font-semibold text-white tracking-tight mt-8">
                        Email
                      </h3>

                      {/* Description */}
                      <p className="text-white/40 text-xs font-light leading-relaxed mt-2.5 font-body">
                        Send a message directly to my inbox. I typically reply within 24 hours.
                      </p>
                    </div>

                    {/* Footer link trigger */}
                    <span className="font-mono text-[9px] uppercase tracking-widest text-violet-400 group-hover:text-violet-300 transition-colors duration-200 mt-8 block select-none">
                      Open Channel
                    </span>
                  </a>

                  {/* LinkedIn card */}
                  <a
                    href={CONTACT_DATA.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseMove={(e) => handleMouseMove(e, "linkedin")}
                    onMouseLeave={() => handleMouseLeave("linkedin")}
                    style={linkedinStyle}
                    className="bg-[#0e0e11] border border-white/[0.04] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:bg-[#111114] group card--border-glow bento-section relative overflow-hidden text-left"
                  >
                    <div>
                      {/* Top Row: Icon & Arrow */}
                      <div className="flex justify-between items-start">
                        <div className="text-white shrink-0 w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 group-hover:border-sky-500/20 transition-all duration-300 group-hover:bg-sky-500/5 group-hover:scale-[1.05]">
                          <svg className="w-6 h-6 text-sky-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg font-semibold text-white tracking-tight mt-8">
                        LinkedIn
                      </h3>

                      {/* Description */}
                      <p className="text-white/40 text-xs font-light leading-relaxed mt-2.5 font-body">
                        Connect with me for professional design updates, sharing, and networking.
                      </p>
                    </div>

                    {/* Footer link trigger */}
                    <span className="font-mono text-[9px] uppercase tracking-widest text-sky-400 group-hover:text-sky-300 transition-colors duration-200 mt-8 block select-none">
                      View Profile
                    </span>
                  </a>

                  {/* Behance card */}
                  <a
                    href={CONTACT_DATA.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseMove={(e) => handleMouseMove(e, "behance")}
                    onMouseLeave={() => handleMouseLeave("behance")}
                    style={behanceStyle}
                    className="bg-[#0e0e11] border border-white/[0.04] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:bg-[#111114] group card--border-glow bento-section relative overflow-hidden text-left"
                  >
                    <div>
                      {/* Top Row: Icon & Arrow */}
                      <div className="flex justify-between items-start">
                        <div className="text-white shrink-0 w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 group-hover:border-indigo-500/20 transition-all duration-300 group-hover:bg-indigo-500/5 group-hover:scale-[1.05]">
                          <svg className="w-6 h-6 text-indigo-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.726zm-7.785-4h4.44c-.185-1.383-1.086-1.92-2.295-1.92-1.385 0-2.098.694-2.145 1.92zm-2.965-6.772c-.2-.752-.75-1.356-1.615-1.628-1.086-.343-2.527-.343-3.771-.343H0v16h8.029c1.26 0 2.76-.087 3.913-.557 1.29-.528 2.073-1.675 2.073-3.205 0-1.485-.75-2.768-2.146-3.299.985-.616 1.524-1.585 1.524-2.76 0-.617-.099-1.163-.312-1.608zm-4.382 8.45H3.743v-2.906h4.851c.838 0 1.626.38 1.626 1.453-.001 1.072-.789 1.453-1.627 1.453zm-.211-5.49H3.743V7.394h4.64c.784 0 1.544.332 1.544 1.29 0 .957-.76 1.294-1.544 1.294z"/>
                          </svg>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-lg font-semibold text-white tracking-tight mt-8">
                        Behance
                      </h3>

                      {/* Description */}
                      <p className="text-white/40 text-xs font-light leading-relaxed mt-2.5 font-body">
                        Explore full visual case studies, UI templates, and component design patterns.
                      </p>
                    </div>

                    {/* Footer link trigger */}
                    <span className="font-mono text-[9px] uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200 mt-8 block select-none">
                      See My Work
                    </span>
                  </a>
                </div>
              </ScrollReveal>
            );
          })()}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="w-full border-t border-white/[0.04] bg-[#080809]">
        <div className="max-w-[1320px] mx-auto px-6">
          {/* Top footer row */}
          <div className="py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {/* Brand */}
            <div className="space-y-2">
              <span className="font-heading text-base font-semibold text-white tracking-widest uppercase select-none">
                hammad.design
              </span>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/25 select-none">
                Product Designer · AI Generalist · Entrepreneur
              </p>
            </div>

            {/* Nav links */}
            <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-widest text-white/30">
              {[
                { label: "Work", href: "#work" },
                { label: "Toolkit", href: "#skills" },
                { label: "Process", href: "#process" },
                { label: "Contact", href: "#contact" },
                { label: "Games", href: "/games" },
                { label: "LinkedIn", href: CONTACT_DATA.linkedin, external: true },
                { label: "Behance", href: CONTACT_DATA.behance, external: true },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Bottom footer row */}
          <div className="py-6 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[10px] text-white/20 uppercase tracking-widest select-none">
            <span>© {new Date().getFullYear()} {ABOUT_DATA.shortName} · All rights reserved</span>
            <span className="text-white/15">{CONTACT_DATA.email}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}


