//src/components/layout/Navbar.tsx
import './navbar.css';
import { HireModal } from '../ui/HireModal';
import { FlickerText, type FlickerConfig } from '../ui/FlickerText';
import { useModal } from '../../hooks/useModal';
import { useMemo } from 'react';

export default function Navbar({ introDone = true }: { introDone?: boolean }) {
const hireModal = useModal();

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
            <div className="f-row-sb items-end h-16 content-width base-border">
                <FlickerText 
                    text="sohj.abe" 
                    className="font-bruno icon-text cursor-pointer tracking-[2px] text-[20px]" 
                    runFlicker={introDone}
                    configs={flickerConfigs}
                />
                <div className="f-row items-center gap-1 hire-group cursor-pointer" onClick={hireModal.open}>
                    <div className="w-[4px] h-[4px] rounded-full bg-[var(--hire-text-color)] animation-pulse"></div>
                    <div className="font-jura hire-text tracking-[.3px] animation-pulse
                     text-[13px]">Available for Hire</div>
                </div>
            </div>
        </nav>
        <HireModal isOpen={hireModal.isOpen} onClose={hireModal.close} />
    </>
    )
}