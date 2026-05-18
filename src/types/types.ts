//src/types/types.ts
import { type ComponentType } from 'react';

export type HeroActionLink = {
    href: string;
    label: string;
    ariaLabel: string;
    Icon: ComponentType<{ className?: string }>;
    target?: '_blank';
    rel?: string;
};

export type HeroCard = {
    title: string;
    description: string;
    Icon: ComponentType<{ className?: string }>;
};