//src/components/layout/Navbar.tsx
import './navbar.css';
import { HireModal } from '../ui/HireModal';
import { useModal } from '../../hooks/useModal';

export default function Navbar(){
const hireModal = useModal();
    return(
    <>
        <nav>
            <div className="f-row-sb items-end h-16 content-width base-border">
                <div className="font-bruno icon-text cursor-pointer tracking-[2px]
                     text-[20px]">sohj.abe</div>
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