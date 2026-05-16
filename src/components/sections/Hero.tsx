//src/components/sections/Hero.tsx
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';
import { slideTransitionWithDuration } from '../../lib/animations';
import { FileText, Mail } from 'lucide-react';
import { LuGithub, LuLinkedin } from 'react-icons/lu';
import { type ComponentType } from 'react';
import './Hero.css';

const heroPicIntroTransition = slideTransitionWithDuration(0.8);
const heroNameIntroTransition = slideTransitionWithDuration(0.95);
const heroBigTextIntroTransition = slideTransitionWithDuration(1.2);
const heroRoleIntroTransition = slideTransitionWithDuration(1.5);
const heroIconsIntroBaseDelay = 1.6;
const heroIconsIntroDelayStep = 0.08;

type HeroActionLink = {
    href: string;
    label: string;
    ariaLabel: string;
    Icon: ComponentType<{ className?: string }>;
    target?: '_blank';
    rel?: string;
};

export default function Hero({ contentVisible = false }: { contentVisible?: boolean }){
    const getHeroIconIntroTransition = (index: number) =>
        slideTransitionWithDuration(heroIconsIntroBaseDelay + index * heroIconsIntroDelayStep);

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

    return(
        <section>
            <div className="f-col-y-center md:f-row-sb md:items-start 
             mt-[2px] sm:mt-3 md:mt-[8px]
             content-width">
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
        </section>
    )
}
