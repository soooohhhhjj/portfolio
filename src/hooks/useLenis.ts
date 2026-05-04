import { useEffect } from "react";
import { lenis } from "../lib/lenis";

export function useLenis() {
  useEffect(() => {
    let frame: number;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => cancelAnimationFrame(frame);
  }, []);
}