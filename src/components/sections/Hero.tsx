//src/components/sections/Hero.tsx
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';
import { slideTransitionWithDuration } from '../../lib/animations';
import { FileText, Mail } from 'lucide-react';
import { LuGithub, LuLinkedin } from 'react-icons/lu';
import { type ComponentType } from 'react';
import './Hero.css';

const heroPicIntroTransition = slideTransitionWithDuration(1.2);
const heroTextIntroTransition = slideTransitionWithDuration(1.3);
const heroNameIntroTransition = slideTransitionWithDuration(1.35);
const heroBigTextIntroTransition = slideTransitionWithDuration(1.4);
const heroRoleIntroTransition = slideTransitionWithDuration(1.45);

type HeroActionLink = {
    href: string;
    label: string;
    ariaLabel: string;
    Icon: ComponentType<{ className?: string }>;
    target?: '_blank';
    rel?: string;
};

export default function Hero({ contentVisible = false }: { contentVisible?: boolean }){
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
             mt-3 md:mt-[8px]
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
                        className="overflow-hidden max-h-[410px] sm:max-h-[580px]"
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}hero-pic/grad-pic.jpg`}
                            alt="Profile"
                            className="object-cover object-top w-full h-full"
                        />
                    </GlassCard>
                </motion.div>

                {/* Text Content Container */}
                <motion.div
                    initial={{ y: '100vh' }}
                    animate={{ y: contentVisible ? 0 : '100vh' }}
                    transition={heroTextIntroTransition}
                    className="mt-2 w-fit text-center md:text-start md:ml-auto"
                >
                    {/* Hero Name Text */}
                    <motion.p
                        initial={{ y: '100vh' }}
                        animate={{ y: contentVisible ? 0 : '100vh' }}
                        transition={heroNameIntroTransition}
                        className="hero-name-text font-semibold
                        text-[12px] sm:text-[18px] md:text-[14px] lg:text-[17px]
                        tracking-[.3px] sm:tracking-[1.5px]"
                    >
                        Hi, I&apos;m Carlo Joshua B. Abellera, and I enjoy
                    </motion.p>

                    {/* Hero Big Text */}
                    <motion.h2
                        initial={{ y: '100vh' }}
                        animate={{ y: contentVisible ? 0 : '100vh' }}
                        transition={heroBigTextIntroTransition}
                        className="mt-2 inline-block font-anta font-extrabold 
                        md:leading-[64px] lg:leading-[83px] tracking-tight
                        text-[32px] sm:text-[61px] md:text-[47px] lg:text-[61px]"
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
                        mt-10 md:mt-8
                        text-[16px] sm:text-[24px] md:text-[20px] lg:text-[26px]"
                    >
                        Full-Stack Developer
                    </motion.p>

                    {/* Hero Call-to-Action Links Container */}
                    <div className="hi-mc md:justify-start
                     mt-6 sm:mt-7 md:mt-5
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
                                transition={slideTransitionWithDuration(1.5 + index * 0.05)}
                                className="hi-lc md:h-[calc(var(--hero-action-icon-size)+10px)]"
                            >
                                <Icon className="hi-lc-icon" />
                                <span className="hi-lc-label 
                                 lg:text-sm">{label}</span>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
