import { useEffect, useRef, useState } from "react";
import './welcome.css';

interface WelcomeProps {
    onDone: () => void;
}

const WELCOME_TEXT = 'Welcome to my Portfolio Website.😄';
const TEXT_CHARS = Array.from(WELCOME_TEXT);
const TYPING_SPEED = 40;
const ON_TYPING_DONE_BUFFER_TIME = 1800;

export default function Welcome({ onDone }: WelcomeProps) {
    const [count, setCount] = useState(0);
    const displayed = TEXT_CHARS.slice(0, count).join('');
    const isTypingDone = count >= TEXT_CHARS.length;

    const indexRef = useRef(0);
    const timeoutRef = useRef<number | null>(null);
    const onDoneRef = useRef(onDone);

    useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

    useEffect(() => {
        const tick = () => {
            const index = indexRef.current;

            if (index >= TEXT_CHARS.length) {
                timeoutRef.current = window.setTimeout(() => {
                    onDoneRef.current();
                }, ON_TYPING_DONE_BUFFER_TIME);
                return;
            }

            setCount(c => c + 1);
            indexRef.current += 1;
            timeoutRef.current = window.setTimeout(tick, TYPING_SPEED);
        };

        timeoutRef.current = window.setTimeout(tick, TYPING_SPEED);

        return () => {
            if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <section>
            <div className="col-xy-center min-h-screen content-width 
             font-jura welcome-text tracking-[1px] text-center
             text-[26px]">
                <div>
                    {displayed}
                    <span className={`welcome-caret ${isTypingDone ? 'welcome-caret--blink' : ''}`} />
                </div>
            </div>
        </section>
    );
}