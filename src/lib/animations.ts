import { type Transition } from "framer-motion";

export const SLIDE_TRANSITION: Transition = {
  duration: 1,
  ease: [0.12, 0.7, 0.63, 0.9],
};

export const slideTransitionWithDuration = (duration: number): Transition => ({
  ...SLIDE_TRANSITION,
  duration,
});

export const SLIDE_DURATION_MS = (SLIDE_TRANSITION.duration as number) * 1000;
