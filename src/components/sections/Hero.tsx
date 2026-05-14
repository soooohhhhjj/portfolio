//src/components/sections/Hero.tsx
import { GlassCard } from '../ui/GlassCard';
import { motion } from 'framer-motion';
import { slideTransitionWithDuration } from '../../lib/animations';

const heroPicIntroTransition = slideTransitionWithDuration(1.2);
const heroTextIntroTransition = slideTransitionWithDuration(1.3);

export default function Hero({ contentVisible = false }: { contentVisible?: boolean }){
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
                        width="max-w-full md:max-w-[272px] lg:max-w-[320px]"
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

                <motion.div
                    initial={{ y: '100vh' }}
                    animate={{ y: contentVisible ? 0 : '100vh' }}
                    transition={heroTextIntroTransition}
                >
                    Hero Text
                </motion.div>
            </div>
        </section>
    )
}