//src/components/sections/Hero.tsx
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';
import { slideTransitionWithDuration } from '../../lib/animations';
import { BugOff, FileText, GraduationCap, LaptopMinimalCheck, Layers, Mail } from 'lucide-react';
import { LuGithub, LuLinkedin } from 'react-icons/lu';
import { type ComponentType } from 'react';
import './Hero.css';

const heroPicIntroTransition = slideTransitionWithDuration(0.8);
const heroNameIntroTransition = slideTransitionWithDuration(0.95);
const heroBigTextIntroTransition = slideTransitionWithDuration(1.2);
const heroRoleIntroTransition = slideTransitionWithDuration(1.5);
const heroIconsIntroBaseDelay = 1.6;
const heroIconsIntroDelayStep = 0.08;
const heroHighlightsIntroTransition = slideTransitionWithDuration(1.6);
const heroCardsIntroBaseDelay = 1.7;
const heroCardsIntroDelayStep = 0.2;

type HeroActionLink = {
    href: string;
    label: string;
    ariaLabel: string;
    Icon: ComponentType<{ className?: string }>;
    target?: '_blank';
    rel?: string;
};

type HeroCard = {
    title: string;
    description: string;
    Icon: ComponentType<{ className?: string }>;
};

export default function Hero({ contentVisible = false }: { contentVisible?: boolean }){
    const getHeroIconIntroTransition = (index: number) =>
        slideTransitionWithDuration(heroIconsIntroBaseDelay + index * heroIconsIntroDelayStep);
    const getHeroCardIntroTransition = (index: number) =>
        slideTransitionWithDuration(heroCardsIntroBaseDelay + index * heroCardsIntroDelayStep);

    const heroActionLinks: HeroActionLink[] = [
        { href: '#', label: 'Resume', ariaLabel: 'Open resume', Icon: FileText },
        {
            href: 'https://github.com/soooohhhhjj',
            label: 'GitHub',
            ariaLabel: 'Open GitHub profile',
            Icon: LuGithub,
            target: '_blank',
            rel: 'noopener noreferrer',
        },
        {
            href: 'https://linkedin.com/in/carlojoshua-abellera',
            label: 'LinkedIn',
            ariaLabel: 'Open LinkedIn profile',
            Icon: LuLinkedin,
            target: '_blank',
            rel: 'noopener noreferrer',
        },
        {
            href: 'mailto:carlojoshua.abellera.ph@gmail.com',
            label: 'Email',
            ariaLabel: 'Send an email',
            Icon: Mail,
        },
    ];
    const heroCards: HeroCard[] = [
        {
            title: 'BSIT Graduate',
            description: 'Bachelor of Science in Information Technology',
            Icon: GraduationCap,
        },
        {
            title: 'IT Intern Exp.',
            description: 'Technical support, system deployment & reporting',
            Icon: LaptopMinimalCheck,
        },
        {
            title: 'SysArch Thesis',
            description: 'Lead Developer - Inventory Management System',
            Icon: Layers,
        },
        {
            title: 'Capstone Thesis',
            description: 'Planning, debugging & feature support',
            Icon: BugOff,
        },
    ];

    return(
        <section>
            <div className="content-width">
                <div className="f-col-y-center md:f-row-sb md:items-start 
                 mt-[2px] sm:mt-3 md:mt-[8px]">
                    <motion.div
                        initial={{ y: '100vh' }}
                        animate={{ y: contentVisible ? 0 : '100vh' }}
                        transition={heroPicIntroTransition}
                    >
                        <GlassCard
                            width="max-w-full md:max-w-[260px] lg:max-w-[320px]"
                            corner="rounded-[7px]"
                            shadow="shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                            className="overflow-hidden max-h-[395px] sm:max-h-[580px]"
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
                            initial={{ y: '100vh' }}
                            animate={{ y: contentVisible ? 0 : '100vh' }}
                            transition={heroNameIntroTransition}
                            className="hero-name-text font-semibold
                            text-[14px] sm:text-[18px] md:text-[14px] lg:text-[17px]
                            tracking-[.4px] sm:tracking-[1.5px]"
                        >
                            Hi, I&apos;m Carlo Joshua B. Abellera, and I enjoy
                        </motion.p>

                        {/* Hero Big Text */}
                        <motion.h2
                            initial={{ y: '100vh' }}
                            animate={{ y: contentVisible ? 0 : '100vh' }}
                            transition={heroBigTextIntroTransition}
                            className="inline-block font-anta font-extrabold 
                            mt-3 sm:mt-4 md:mt-2
                            leading-[50px] sm:leading-[75px] md:leading-[64px] lg:leading-[78px] tracking-tight
                            text-[38px] sm:text-[61px] md:text-[47px] lg:text-[61px]"
                        >
                            <span className="hero-big-text">Building pixel-perfect</span>
                            <br />
                            <span className="hero-big-text">Interactive Websites</span>
                        </motion.h2>

                        {/* Hero Role Text */}
                        <motion.p
                            initial={{ y: '100vh' }}
                            animate={{ y: contentVisible ? 0 : '100vh' }}
                            transition={heroRoleIntroTransition}
                            className="hero-role-text font-bruno font-[500] tracking-[1px]
                            mt-10 md:mt-9 lg:mt-10
                            text-[19px] sm:text-[25px] md:text-[22px] lg:text-[26px]"
                        >
                            Full-Stack Developer
                        </motion.p>

                        {/* Hero Call-to-Action Links Container */}
                        <div className="hi-mc md:justify-start
                         mt-4 sm:mt-7 md:mt-4 lg:mt-6
                         [--hero-action-icon-size:21px] 
                         md:[--hero-action-icon-size:18px]
                         lg:[--hero-action-icon-size:22px]">
                            {heroActionLinks.map(({ href, label, ariaLabel, Icon, target, rel }, index) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target={target}
                                    rel={rel}
                                    aria-label={ariaLabel}
                                    initial={{ y: '100vh' }}
                                    animate={{ y: contentVisible ? 0 : '100vh' }}
                                    transition={getHeroIconIntroTransition(index)}
                                    className="hi-lc md:h-[calc(var(--hero-action-icon-size)+10px)]"
                                >
                                    <Icon className="hi-lc-icon" />
                                    <span className="hi-lc-label 
                                     lg:text-sm">{label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-12 md:mt-9 lg:mt-12">
                    <motion.p
                        initial={{ y: '100vh' }}
                        animate={{ y: contentVisible ? 0 : '100vh' }}
                        transition={heroHighlightsIntroTransition}
                        className="highlights-title font-bruno uppercase tracking-[1.5px] 
                         text-[14px] sm:text-[16px] md:text-start md:text-[11px] lg:text-[15px]
                         mb-7 md:mb-4 lg:mb-5"
                    >
                        Highlights
                    </motion.p>

                    {/* Container of the cards */}
                    <div className="f-col gap-5 md:f-row-sb md:gap-0">
                        {heroCards.map(({ title, description, Icon }, index) => (
                            <motion.div
                                key={title}
                                initial={{ y: '100vh' }}
                                animate={{ y: contentVisible ? 0 : '100vh' }}
                                transition={getHeroCardIntroTransition(index)}
                                className="relative rounded-[7px] w-full hc-bd
                                 md:w-[calc(25%-9px)] lg:w-[calc(25%-12px)]
                                 p-4 md:p-5 lg:p-6"
                            >
                                <div className="f-y-center
                                 md:f-col-x-start gap-3 lg:gap-5">
                                    <div className="f-xy-center hc-icd
                                     rounded-[6px] lg:rounded-[6px]
                                     h-10 md:h-[45px] lg:h-[50px] 
                                     w-16 md:w-[45px] lg:w-[50px]">
                                        <Icon className=" 
                                         w-[18px] lg:w-6 
                                         h-[18px] lg:h-6" />
                                    </div>
                                    <div className="f-col w-full gap-[6px]">
                                        <h3 className="font-bruno tracking-[1px] hc-tohd 
                                         text-[11px] lg:text-[14px]">{title}</h3>
                                        <div className="hc-tud" />
                                    </div>
                                </div>
                                <div className="font-jura leading-[1.5] hc-dohd
                                 md:mt-2 lg:mt-3
                                  text-[11px] md:text-[10px] lg:text-[12px]">
                                    {description}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
