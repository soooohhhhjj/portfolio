//src/components/layout/Navbar.tsx
import './navbar.css';
import { HireModal } from '../ui/HireModal';
import { FlickerText, type FlickerConfig } from '../ui/FlickerText';
import { useModal } from '../../hooks/useModal';
import { useMemo } from 'react';
import { useHintCursor } from '../../hooks/useHintCursor';
import { motion } from 'framer-motion';
import { slideTransitionWithDuration } from '../../lib/animations';

export default function Navbar({
    introDone = true,
    contentVisible = false,
}: {
    introDone?: boolean;
    contentVisible?: boolean;
}) {
    const hireModal = useModal();
    const { containerRef, scope, hasClicked, handleHireClick } = useHintCursor(introDone, hireModal.open);
    const logoIntroTransition = slideTransitionWithDuration(0.6);
    const hireIntroTransition = slideTransitionWithDuration(0.72);

const flickerConfigs = useMemo<Record<number, FlickerConfig>>(() => ({
    0: { intensity: 'strong', duration: 0.55, delay: 0.05 },
    2: { intensity: 'light',  duration: 0.40, delay: 0.12 },
    4: { intensity: 'medium', duration: 0.50, delay: 0.22 },
    6: { intensity: 'strong', duration: 0.60, delay: 0.35 },
    7: { intensity: 'light',  duration: 0.45, delay: 0.41 }
}), []);
    return(
    <>
        <nav>
            <div className="f-row-sb items-end h-16 content-width">
                <motion.div
                    initial={{ y: '100vh' }}
                    animate={{ y: contentVisible ? 0 : '100vh' }}
                    transition={logoIntroTransition}
                >
                    <FlickerText 
                        text="sohj.abe" 
                        className="font-bruno icon-text cursor-pointer tracking-[2px] 
                        text-[20px] md:text-[18px] lg:text-[20px]" 
                        runFlicker={introDone}
                        configs={flickerConfigs}
                        onClick={() => window.location.reload()}
                    />
                </motion.div>

                <motion.div
                    initial={{ y: '100vh' }}
                    animate={{ y: contentVisible ? 0 : '100vh' }}
                    transition={hireIntroTransition}
                >
                    <div 
                        ref={containerRef}
                        className="f-row items-center gap-1 hire-group cursor-pointer relative" 
                        onClick={handleHireClick}
                    >
                        {/* Fake hint cursor */}
                        {!hasClicked && (
                            <span className="hire-hint-cursor" aria-hidden="true" ref={scope}>
                                <svg width="18" height="21" viewBox="0 0 16 20" fill="none">
                                    <path d="M0 0L0 16L4 12L7 19L9.5 18L6.5 11L12 11Z" fill="white" stroke="#333" strokeWidth="1"/>
                                </svg>
                            </span>
                        )}

                        <div className="w-[4px] h-[4px] rounded-full bg-[var(--hire-text-color)] animation-pulse"></div>
                        <div className="font-jura hire-text tracking-[.3px] animation-pulse
                         text-[13px] md:text-[11px] lg:text-[13px]">Available for Hire</div>
                    </div>
                </motion.div>
            </div>
        </nav>
        <HireModal isOpen={hireModal.isOpen} onClose={hireModal.close} />
    </>
    )
}
