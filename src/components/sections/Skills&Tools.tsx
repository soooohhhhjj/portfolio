import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { Database, PaintbrushVertical, Server, Wrench } from 'lucide-react';
import {
  FaBootstrap,
  FaCss3Alt,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaJava,
  FaNodeJs,
  FaPhp,
  FaPython,
  FaReact,
} from 'react-icons/fa';
import {
  SiAndroidstudio,
  SiCloudinary,
  SiCplusplus,
  SiExpress,
  SiFirebase,
  SiJavascript,
  SiMongodb,
  SiMongoose,
  SiMysql,
  SiPostman,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';
import type { IconType } from 'react-icons';
import { VscVscode } from 'react-icons/vsc';

import { GlassCard } from '../ui/GlassCard';
import { skillsContentData } from '../../data/skillsData';
import type { SkillsCard } from '../../types/skills';
import './Skills&Tools.css';

const iconMap: Record<string, IconType> = {
  react: FaReact,
  typescript: SiTypescript,
  tailwindcss: SiTailwindcss,
  javascript: SiJavascript,
  html5: FaHtml5,
  java: FaJava,
  python: FaPython,
  css3: FaCss3Alt,
  bootstrap: FaBootstrap,
  nodejs: FaNodeJs,
  express: SiExpress,
  php: FaPhp,
  firebase: SiFirebase,
  mongodb: SiMongodb,
  mongoose: SiMongoose,
  mysql: SiMysql,
  git: FaGitAlt,
  github: FaGithub,
  postman: SiPostman,
  cloudinary: SiCloudinary,
  cpp: SiCplusplus,
  vscode: VscVscode,
  androidstudio: SiAndroidstudio,
};

type HeaderIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const cardIconMap: Record<string, HeaderIconComponent> = {
  frontend: PaintbrushVertical,
  backend: Server,
  database: Database,
  tools: Wrench,
};

const cardIconClassMap: Record<string, string> = {
  frontend: 'h-[23px] w-[23px]',
  backend: 'h-[21px] w-[21px]',
  database: 'h-[21px] w-[21px]',
  tools: 'h-[21px] w-[21px]',
};

const SKILLS_CANVAS_MIN_HEIGHT = 620;

function resolveCanvasHeight(cards: SkillsCard[]) {
  const furthestBottom = cards.reduce((maxBottom, card) => (
    Math.max(maxBottom, card.layout.y + card.layout.height)
  ), 0);

  return Math.max(SKILLS_CANVAS_MIN_HEIGHT, furthestBottom);
}

function SkillsAnimatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span
          key={`${text}-${index}`}
          className={`sk-fc ${
            index % 7 === 0
              ? 'sk-fc--strong'
              : index % 5 === 0
                ? 'sk-fc--medium'
                : index % 3 === 0
                  ? 'sk-fc--light'
                  : ''
          }`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

function SkillsStackItem({
  icon,
  name,
}: {
  icon: string;
  name: string;
}) {
  const Icon = iconMap[icon];

  return (
    <div
      className="
        skc-si inline-flex min-h-[40px] items-center
        gap-[0.45rem] py-[0.45rem]
      "
    >
      <span
        className="
          skc-sii inline-flex h-[20px] w-[20px]
          items-center justify-center text-[20px]
        "
        aria-hidden="true"
      >
        {Icon ? <Icon /> : null}
      </span>
      <span className="skc-sin text-[12px] tracking-[0.3px]">
        {name}
      </span>
    </div>
  );
}

function SkillsPanelContent({
  card,
}: {
  card: SkillsCard;
}) {
  const HeaderIcon = cardIconMap[card.id];
  const [animationKey, setAnimationKey] = useState(0);

  return (
    <GlassCard
      className="skc-sd relative flex h-full flex-col rounded-[2px] px-4 py-5 md:px-5 md:py-6"
      onMouseEnter={() => setAnimationKey((previous) => previous + 1)}
    >
      <div className="skc-tt-wrap flex flex-col gap-[0.55rem]">
        <div className="flex items-center justify-between gap-4 px-[2px]">
          <h3 className="skc-tt font-bruno text-[17px] font-semibold tracking-[0.8px] sm:text-[18px]">
            <span key={`title-${card.id}-${animationKey}`} className="skc-tt-w">
              <SkillsAnimatedText text={card.title} />
            </span>
          </h3>
          {HeaderIcon ? (
            <span className="skc-icd" aria-hidden="true">
              <span key={`header-${card.id}-${animationKey}`}>
                <HeaderIcon className={cardIconClassMap[card.id] ?? 'h-[16px] w-[16px]'} />
              </span>
            </span>
          ) : null}
        </div>
        <span className="skc-hl" aria-hidden="true" />
      </div>

      <div className="mt-[1.35rem] grid flex-1 grid-cols-1 gap-1">
        <div className="flex flex-col">
          <div className="flex w-full flex-col items-start">
            <div className="flex flex-wrap gap-x-[1.4rem] gap-y-[0.95rem] px-[2px]">
              {card.previousStacks.map((stack) => (
                <SkillsStackItem
                  key={stack.id}
                  icon={stack.icon}
                  name={stack.name}
                />
              ))}
            </div>
            <div className="inline-flex w-full flex-col items-start">
              <span className="skc-gl" aria-hidden="true" />
              <p className="skc-gl-lbl m-0 px-[2px] font-jura text-[10px] tracking-[0.2px] sm:text-[11px]">
                {card.backLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex w-full flex-col items-end">
            <div className="flex flex-wrap justify-end gap-x-[1.4rem] gap-y-[0.95rem] px-[2px]">
              {card.currentStacks.map((stack) => (
                <SkillsStackItem
                  key={stack.id}
                  icon={stack.icon}
                  name={stack.name}
                />
              ))}
            </div>
            <div className="inline-flex w-full flex-col items-end">
              <span className="skc-gl" aria-hidden="true" />
              <p className="skc-gl-lbl m-0 px-[2px] text-right font-jura text-[10px] tracking-[0.2px] sm:text-[11px]">
                {card.frontLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function SkillsNTools({ shouldAnimate = true }: { shouldAnimate?: boolean }) {
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === 'undefined' ? 1024 : window.innerWidth,
  );
  const activeLayoutKey = viewportWidth >= 1024 ? 'lg' : 'md';
  const layoutMode = viewportWidth >= 768 ? 'desktop' : 'linear';

  const laneRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setCanvasWidth(entries[0]?.contentRect.width ?? 0);
    });

    resizeObserver.observe(lane);
    setCanvasWidth(lane.getBoundingClientRect().width);

    return () => resizeObserver.disconnect();
  }, []);

  const cardsWithLayout = useMemo(() => {
    return skillsContentData.cards.map((card) => {
      if (activeLayoutKey === 'md' && skillsContentData.mdLayout) {
        const mdCard = skillsContentData.mdLayout.cards.find((c) => c.id === card.id);
        if (mdCard) {
          return {
            ...card,
            layout: mdCard.layout,
          };
        }
      }
      return card;
    });
  }, [activeLayoutKey]);

  const displayCanvasHeight = useMemo(() => resolveCanvasHeight(cardsWithLayout), [cardsWithLayout]);

  const activeCanvasWidth = useMemo(() => {
    if (viewportWidth >= 1024) return 930;
    if (viewportWidth >= 768) return 760;
    return 930;
  }, [viewportWidth]);

  const scale = useMemo(() => {
    if (!canvasWidth || canvasWidth >= activeCanvasWidth) return 1;
    return canvasWidth / activeCanvasWidth;
  }, [canvasWidth, activeCanvasWidth]);

  const titleLayout = skillsContentData.titleLayout ?? { x: 225, y: 13 };



  return (
    <section className="relative w-full overflow-visible box-border font-jura mt-16 text-[rgb(var(--base-color))]">
      <div className="content-width">
        {layoutMode !== 'desktop' ? (
          <div className="text-center mt-[22px] sm:mt-[26px] mb-[30px] sm:mb-[40px]">
            <h2 className="sk-tt font-bruno font-bold text-[27px] xxsm:text-[30px] xsm:text-[35px] sm:text-[45px]">
              <SkillsAnimatedText text={skillsContentData.title} />
            </h2>
          </div>
        ) : null}

        {layoutMode === 'desktop' ? (
          <div ref={laneRef} className="sk-el relative z-[1] mt-[2.35rem] w-full">
            <div
              className="sk-ms"
              style={{ height: `${displayCanvasHeight * scale}px` }}
            >
              <div
                className="absolute left-1/2"
                style={{
                  width: `${activeCanvasWidth}px`,
                  height: `${displayCanvasHeight}px`,
                  transform: `translateX(-50%) scale(${scale})`,
                  transformOrigin: 'top center',
                }}
              >
                <div
                  className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{
                    top: `${titleLayout.y}px`,
                    zIndex: 10,
                  }}
                >
                  <motion.div
                    className="sk-to"
                    initial={{ opacity: 0, y: 10 }}
                    animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, ease: [0.12, 0.7, 0.63, 0.9] }}
                  >
                    <h2 className="sk-tt font-bruno font-bold text-[rgb(var(--base-color))] md:text-5xl">
                      <SkillsAnimatedText text={skillsContentData.title} />
                    </h2>
                  </motion.div>
                </div>

                {cardsWithLayout.map((card) => (
                  <motion.article
                    key={card.id}
                    className="sk-mc absolute"
                    style={{
                      left: `${card.layout.x}px`,
                      top: `${card.layout.y}px`,
                      width: `${card.layout.width}px`,
                      height: `${card.layout.height}px`,
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.55, ease: [0.12, 0.7, 0.63, 0.9] }}
                  >
                    <SkillsPanelContent
                      card={card}
                    />
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="
              relative z-[1] flex flex-col
              gap-7 sm:gap-10
            "
          >
            {cardsWithLayout.map((card, index) => (
              <motion.article
                key={card.id}
                className="relative w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  duration: 0.55,
                  delay: 0.1 + index * 0.09,
                  ease: [0.12, 0.7, 0.63, 0.9],
                }}
              >
                <SkillsPanelContent
                  card={card}
                />
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}