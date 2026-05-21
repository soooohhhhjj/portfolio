//src/components/sections/Hero.tsx
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';
import { slideTransitionWithDuration } from '../../lib/animations';
import { BugOff, FileText, GraduationCap, LaptopMinimalCheck, Layers, Mail } from 'lucide-react';
import { LuGithub, LuLinkedin } from 'react-icons/lu';
import type { HeroActionLink, HeroCard } from '../../types/types';
import './Hero.css';

const slideUp = {
    hidden:  { y: '100vh' },
    visible: { y: 0 },
};

const transitions = {
    pic:        slideTransitionWithDuration(0.8),
    name:       slideTransitionWithDuration(0.95),
    bigText:    slideTransitionWithDuration(1.2),
    role:       slideTransitionWithDuration(1.5),
    highlights: slideTransitionWithDuration(1.6),
};

const ICON_BASE_DELAY = 1.6;
const ICON_DELAY_STEP = 0.08;
const CARD_BASE_DELAY = 1.7;
const CARD_DELAY_STEP = 0.2;

const getIconTransition = (i: number) =>
    slideTransitionWithDuration(ICON_BASE_DELAY + i * ICON_DELAY_STEP);

const getCardTransition = (i: number) =>
    slideTransitionWithDuration(CARD_BASE_DELAY + i * CARD_DELAY_STEP);

const heroActionLinks: HeroActionLink[] = [
    { href: '#', 
      label: 'Resume', 
      ariaLabel: 'Open resume', 
      Icon: FileText },
    { href: 'https://github.com/soooohhhhjj', 
      label: 'GitHub', 
      ariaLabel: 'Open GitHub profile', 
      Icon: LuGithub, 
      target: '_blank', 
      rel: 'noopener noreferrer' },
    { href: 'https://linkedin.com/in/carlojoshua-abellera', 
      label: 'LinkedIn', 
      ariaLabel: 'Open LinkedIn profile', 
      Icon: LuLinkedin, 
      target: '_blank', 
      rel: 'noopener noreferrer' },
    { href: 'mailto:carlojoshua.abellera.ph@gmail.com', 
      label: 'Email', 
      ariaLabel: 'Send an email', 
      Icon: Mail },
];

const heroCards: HeroCard[] = [
    { title: 'BSIT Graduate',   
      description: 'Bachelor of Science in Information Technology',   
      Icon: GraduationCap },
    { title: 'IT Intern Exp.',  
      description: 'Technical support, system deployment & reporting', 
      Icon: LaptopMinimalCheck },
    { title: 'SysArch Thesis',  
      description: 'Lead Developer - Inventory Management System',    
      Icon: Layers },
    { title: 'Capstone Thesis', 
      description: 'Planning, debugging & feature support',           
      Icon: BugOff },
];

export default function Hero({
    contentVisible = false,
    onResumeClick,
}: {
    contentVisible?: boolean;
    onResumeClick?: () => void;
}) {
    const animate = contentVisible ? 'visible' : 'hidden';

    return (
        <section>
            <div className="content-width">
                <div className="f-col-y-center md:f-row-sb md:items-start 
                 mt-[2px] sm:mt-3 md:mt-[8px]">

                    <motion.div variants={slideUp} initial="hidden" animate={animate} transition={transitions.pic}>
                        <GlassCard
                            width="max-w-full md:max-w-[260px] lg:max-w-[320px]"
                            corner="rounded-[7px]"
                            shadow="shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                            className="overflow-hidden max-h-[380px] sm:max-h-[580px]"
                        >
                            <img
                                src={`${import.meta.env.BASE_URL}hero-pic/grad-pic.jpg`}
                                alt="Profile"
                                className="object-cover object-top w-full h-full"
                            />
                        </GlassCard>
                    </motion.div>

                    {/* Text Content Container */}
                    <div className="mt-12 md:mt-2 w-fit text-center md:text-start md:ml-auto">
                        {/* Hero Name Text */}
                        <motion.p
                            variants={slideUp} initial="hidden" animate={animate} transition={transitions.name}
                            className="hero-name-text font-semibold 
                             text-[13px] sm:text-[18px] md:text-[14px] lg:text-[17px] 
                             tracking-[.4px] sm:tracking-[1.5px]"
                        >
                            Hi, I&apos;m Carlo Joshua B. Abellera, and I enjoy
                        </motion.p>

                        {/* Hero Big Text */}
                        <motion.h2
                            variants={slideUp} initial="hidden" animate={animate} transition={transitions.bigText}
                            className="inline-block font-anta font-extrabold 
                             mt-3 sm:mt-4 md:mt-2
                             leading-[50px] sm:leading-[75px] md:leading-[64px] lg:leading-[78px] tracking-tight
                             text-[35px] sm:text-[61px] md:text-[47px] lg:text-[61px]"
                        >
                            <span className="hero-big-text">Building pixel-perfect</span>
                            <br />
                            <span className="hero-big-text">Interactive Websites</span>
                        </motion.h2>

                        {/* Hero Role Text */}
                        <motion.p
                            variants={slideUp} initial="hidden" animate={animate} transition={transitions.role}
                            className="hero-role-text font-bruno font-[500] tracking-[1px]
                            mt-10 md:mt-9 lg:mt-10
                            text-[18px] sm:text-[25px] md:text-[22px] lg:text-[26px]"
                        >
                            Full-Stack Developer
                        </motion.p>

                        {/* Hero Call-to-Action Links Container */}
                        <div className="hi-mc md:justify-start
                         mt-[22px] sm:mt-7 md:mt-4 lg:mt-6
                         [--hero-action-icon-size:21px] 
                         md:[--hero-action-icon-size:18px]
                         lg:[--hero-action-icon-size:22px]">
                            {heroActionLinks.map(({ href, label, ariaLabel, Icon, target, rel }, i) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target={target}
                                    rel={rel}
                                    aria-label={ariaLabel}
                                    variants={slideUp}
                                    initial="hidden"
                                    animate={animate}
                                    transition={getIconTransition(i)}
                                    className="hi-lc md:h-[calc(var(--hero-action-icon-size)+10px)]"
                                    onClick={label === 'Resume' ? (e) => {
                                        e.preventDefault();
                                        onResumeClick?.();
                                    } : undefined}
                                >
                                    <Icon className="hi-lc-icon" />
                                    <span className="hi-lc-label lg:text-sm">{label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-24 md:mt-9 lg:mt-12">
                    <motion.p
                        variants={slideUp} initial="hidden" animate={animate} transition={transitions.highlights}
                        className="highlights-title font-bruno uppercase tracking-[1.5px] 
                         text-[13px] sm:text-[14px] md:text-[11px] lg:text-[15px]
                         mb-7 md:mb-4 lg:mb-5
                         text-center md:text-start"
                    >
                        Highlights
                    </motion.p>

                    {/* Container of the cards */}
                    <div className="f-col gap-5 md:f-row-sb md:gap-0">
                        {heroCards.map(({ title, description, Icon }, i) => (
                            <motion.div
                                key={title}
                                variants={slideUp}
                                initial="hidden"
                                animate={animate}
                                transition={getCardTransition(i)}
                                className="relative rounded-[7px] w-full hc-bd
                                 md:w-[calc(25%-9px)] lg:w-[calc(25%-12px)]
                                 p-4 md:p-5 lg:p-6"
                            >
                                <div className="f-y-center md:f-col-x-start 
                                 gap-3 md:gap-4 lg:gap-[22px]">
                                    <div className="f-xy-center hc-icd rounded-[6px]
                                     h-12 md:h-[45px] lg:h-[50px] 
                                     w-16 md:w-[45px] lg:w-[50px]">
                                        <Icon className=" 
                                         w-[18px] lg:w-6 
                                         h-[18px] lg:h-6" />
                                    </div>
                                    <div className="f-col w-full">
                                        <h3 className="font-bruno tracking-[1px] hc-tohd 
                                         text-[11px] lg:text-[14px]">{title}</h3>
                                        <div className="hc-tud mt-1 md:mt-[5px] lg:mt-[6px]" />
                                        <div className="font-jura leading-[1.5] hc-dohd
                                         mt-1 md:mt-[7px] lg:mt-2
                                         text-[11px] md:text-[10px] lg:text-[12px]">
                                            {description}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}