// src/components/sections/RelevantExperiences.tsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { BriefcaseBusiness, FolderKanban } from 'lucide-react';
import { AnimatedCloseIcon } from '../ui/AnimatedCloseIcon';
import { GlassCard } from '../ui/GlassCard';
import { ModalOverlay } from '../ui/ModalOverlay';
import { lenis as globalLenis } from '../../lib/lenis';
import { relevantExperiencesContentData } from '../../data/relevantExperiencesData';
import type {
  RelevantExperienceNode,
} from '../../types/relevantExperiences';
import BouncingLogoDisplay from '../ui/BouncingLogoDisplay';
import RelevantExperienceConnections from './RelevantExperienceConnections';
import './RelevantExperiences.css';

const MIN_CANVAS_WIDTH = 930;

function resolveCanvasHeight(nodes: RelevantExperienceNode[]) {
  return nodes.reduce(
    (maxBottom, node) => Math.max(maxBottom, node.layout.y + node.layout.height),
    0
  );
}

function onKeyActivate(fn: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };
}

function ParentCardContent({ parent }: { parent: RelevantExperienceNode }) {
  return (
    <article className="rec-sd rec-sd--framed rec-sd--glass relative w-full border-none p-[17.6px] overflow-visible">
      <div className="f-y-center gap-[13.6px]">
        {parent.icon && (
          <div className="rec-icd relative inline-flex items-center justify-center w-12 h-[40.8px] shrink-0">
            {parent.icon === 'briefcase-business' ? (
              <BriefcaseBusiness className="w-[22.4px] h-[22.4px]" strokeWidth={1.3} />
            ) : (
              <FolderKanban className="w-[22.4px] h-[22.4px]" strokeWidth={1.3} />
            )}
          </div>
        )}
        <h3 className="text-[15.04px] font-bold tracking-[0.1px] whitespace-normal leading-[1.3]">{parent.title}</h3>
      </div>
      <p className="mt-[11.52px] pt-[12.8px] border-t border-dashed border-[rgb(var(--base-color)/0.28)] text-[13.12px] leading-[1.55] opacity-[0.72]">{parent.details}</p>
    </article>
  );
}

function ChildCardContent({ child }: { child: RelevantExperienceNode }) {
  const isBounce = child.logoAnimation === 'bounce';
  return (
    <article className="rec-sd rec-sd--framed rec-sd--glass relative w-full border-none p-4 max-sm:p-[14.08px] overflow-visible shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
      {child.image && (
        <GlassCard
          width="w-full"
          corner="rounded-[2px]"
          shadow=""
          className="overflow-hidden mb-3 aspect-auto"
        >
          {isBounce ? (
            <BouncingLogoDisplay
              src={`${import.meta.env.BASE_URL}${child.image}`}
              alt={child.title}
              className="!min-h-[134.4px]"
              logoClassName="rem-dla !w-[clamp(84px,34%,115.2px)]"
            />
          ) : (
            <img
              src={`${import.meta.env.BASE_URL}${child.image}`}
              alt={child.title}
              className="block w-full h-auto"
              loading="lazy"
              draggable={false}
            />
          )}
        </GlassCard>
      )}
      <div className="relative z-10 overflow-hidden">
        <h4 className="text-[15.2px] font-bold tracking-[0.1px] leading-[1.35] whitespace-normal">{child.title}</h4>
        <p className="mt-[1.6px] mb-0 pl-[2px] text-[rgb(var(--base-color)/0.7)] text-[11.84px] leading-[1.45] tracking-[0.06px] overflow-hidden">{child.details}</p>
        {child.previewTags && child.previewTags.length > 0 && (
          <div className="flex flex-wrap gap-[6.08px] mt-[4.8px] pl-[2px] overflow-hidden" aria-label={`${child.title} tags`}>
            {child.previewTags.map((tag) => (
              <span key={tag} className="rec-td">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

interface RelevantExperienceModalProps {
  node: RelevantExperienceNode | null;
  childNodes: RelevantExperienceNode[];
  onSelectNode: (nodeId: string) => void;
  onClose: () => void;
}

function ParentModalBody({
  node,
  childNodes,
  onSelectNode,
}: {
  node: RelevantExperienceNode;
  childNodes: RelevantExperienceNode[];
  onSelectNode: (nodeId: string) => void;
}) {
  return (
    <div className="f-col gap-6">
      <section className="rem-sc rem-sc--pi pb-4">
        <div className="f-y-center gap-[7.2px]">
          <p className="m-0 ml-[4px] text-[rgb(var(--base-color)/0.96)] text-[13.12px] font-bold tracking-[0.05em] uppercase">
            Overview
          </p>
        </div>
        <p className="mt-[9.6px] pl-2 text-[rgb(var(--base-color)/0.84)] text-[15.68px] leading-[1.78] tracking-[0.08px]">{node.details}</p>
      </section>

      <section className="rem-sc">
        <div className="f-y-center gap-[7.2px]">
          <p className="m-0 ml-[4px] text-[rgb(var(--base-color)/0.96)] text-[13.12px] font-bold tracking-[0.05em] uppercase">
            Included Work
          </p>
        </div>
        {childNodes.length > 0 && (
          <div className="grid gap-[11.2px] mt-[8.8px] pl-2">
            {childNodes.map((child) => (
              <button
                key={child.id}
                type="button"
                className="rem-clbd flex items-start justify-between gap-4 w-full px-4 py-[15.2px] text-left text-inherit"
                onClick={() => onSelectNode(child.id)}
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-[rgb(var(--base-color)/0.95)] text-[15.2px] font-bold leading-[1.35]">
                    {child.title}
                  </h4>
                  <p className="mt-[5.6px] text-[rgb(var(--base-color)/0.74)] text-[13.12px] leading-[1.6]">
                    {child.details}
                  </p>
                  {child.previewTags && child.previewTags.length > 0 && (
                    <div className="flex flex-wrap gap-[5.6px] mt-[8.8px]">
                      {child.previewTags.map((tag) => (
                        <span key={tag} className="rec-td min-h-[24.8px] px-[9.92px] pt-[3.52px] pb-[2.88px] text-[11.52px] tracking-[0.12px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="shrink-0 mt-[1.28px] text-[rgb(var(--base-color)/0.56)] text-[11.52px] tracking-[0.08em] uppercase">
                  Open
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TechBullet() {
  return (
    <svg 
      className="shrink-0 mt-[5.5px] w-[11.2px] h-[11.2px] text-[rgb(var(--base-color)/0.8)] filter drop-shadow-[0_0_2px_rgb(var(--base-color)/0.5)]" 
      viewBox="0 0 100 100" 
      fill="currentColor"
    >
      <polygon points="20,10 80,50 20,90 45,50" />
    </svg>
  );
}

function ChildModalBody({ node }: { node: RelevantExperienceNode }) {
  const isBounce = node.logoAnimation === 'bounce';
  const isDevProject = node.parentId === 'dev-academic-projects';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left Column - Sidebar (Logo, Meta, Tags) */}
      <aside className="lg:col-span-4 f-col gap-5 lg:border-r lg:border-dashed lg:border-[rgb(var(--base-color)/0.15)] lg:pr-6">
        {node.image && (
          <section className="rem-sc">
            <GlassCard
              width="w-full"
              corner="rounded-[3px]"
              shadow=""
              className="overflow-hidden rem-mwd border-[rgb(var(--base-color)/0.18)]"
            >
              {isBounce ? (
                <BouncingLogoDisplay src={`${import.meta.env.BASE_URL}${node.image}`} alt={node.title} logoClassName="rem-dla" />
              ) : (
                <img
                  src={`${import.meta.env.BASE_URL}${node.image}`}
                  alt={node.title}
                  className="block w-full h-auto"
                  loading="lazy"
                  draggable={false}
                />
              )}
            </GlassCard>
          </section>
        )}

        {node.companyDescription && (
          <section className="rem-sc bg-[rgb(var(--base-color)/0.02)] p-4 rounded-[4px] border border-[rgb(var(--base-color)/0.06)]">
            <div className="f-y-center gap-[7.2px]">
              <p className="m-0 text-[rgb(var(--base-color)/0.56)] text-[11.52px] font-semibold tracking-[0.08em] uppercase">About the Company</p>
            </div>
            <p className="mt-[9.6px] text-[rgb(var(--base-color)/0.84)] text-[14.08px] leading-[1.65] tracking-[0.05px]">{node.companyDescription}</p>
          </section>
        )}

        {node.modalTags && node.modalTags.length > 0 && (
          <section className="rem-sc">
            <div className="f-y-center gap-[7.2px]">
              <p className="m-0 text-[rgb(var(--base-color)/0.56)] text-[11.52px] font-semibold tracking-[0.08em] uppercase">
                {!isDevProject ? 'Skills' : 'Technologies'}
              </p>
            </div>
            <div className="flex flex-wrap gap-[5.6px] mt-[8px]">
              {node.modalTags.map((tag) => (
                <span key={tag} className="rec-td rem-glow-tag min-h-[24.8px] px-[9.92px] pt-[3.52px] pb-[2.88px] text-[11.52px] tracking-[0.12px]">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* Right Column - Main Details (Dynamic based on blueprint) */}
      <main className="lg:col-span-8 f-col gap-6">
        {/* Academic Projects Blueprint */}
        {isDevProject ? (
          <>
            {/* The Problem */}
            {node.problemText && (
              <section className="rem-sc f-col bg-[rgb(var(--base-color)/0.015)] p-[18px] md:p-[22px] rounded-[6px] border border-[rgb(var(--base-color)/0.06)]">
                <div className="f-y-center gap-[7.2px] border-b border-dashed border-[rgb(var(--base-color)/0.12)] pb-2 mb-[12px]">
                  <p className="m-0 text-[rgb(var(--base-color)/0.88)] text-[12.16px] font-bold tracking-[0.1em] uppercase">The Problem</p>
                </div>
                <p className="m-0 text-[rgb(var(--base-color)/0.84)] text-[14.72px] leading-[1.68] tracking-[0.05px]">{node.problemText}</p>
              </section>
            )}

            {/* The Solution */}
            {node.solutionBullets && node.solutionBullets.length > 0 && (
              <section className="rem-sc f-col bg-[rgb(var(--base-color)/0.02)] p-[18px] md:p-[22px] rounded-[6px] border border-[rgb(var(--base-color)/0.08)]">
                <div className="f-y-center gap-[7.2px] border-b border-dashed border-[rgb(var(--base-color)/0.12)] pb-2 mb-[12px]">
                  <p className="m-0 text-[rgb(var(--base-color)/0.88)] text-[12.16px] font-bold tracking-[0.1em] uppercase">The Solution</p>
                </div>
                <div className="flex-1">
                  <ul className="list-none pl-0 space-y-[8px]" aria-label="The solution key features">
                    {node.solutionBullets.map((item, idx) => (
                      <li key={idx} className="flex gap-[10px] items-start">
                        <TechBullet />
                        <span className="flex-1 min-w-0 text-[rgb(var(--base-color)/0.86)] text-[14.72px] font-normal leading-[1.65] tracking-[0.05px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* My Role */}
            {(node.myRoleBullets || node.myRoleText) && (
              <section className="rem-sc f-col bg-[rgb(var(--base-color)/0.03)] p-[18px] md:p-[22px] rounded-[6px] border border-[rgb(var(--base-color)/0.1)]">
                <div className="f-y-center gap-[7.2px] border-b border-dashed border-[rgb(var(--base-color)/0.12)] pb-2 mb-[12px]">
                  <p className="m-0 text-[rgb(var(--base-color)/0.88)] text-[12.16px] font-bold tracking-[0.1em] uppercase">My Role</p>
                </div>
                <div className="flex-1">
                  {node.myRoleBullets && node.myRoleBullets.length > 0 ? (
                    <ul className="list-none pl-0 space-y-[8px]" aria-label="My role details">
                      {node.myRoleBullets.map((item, idx) => (
                        <li key={idx} className="flex gap-[10px] items-start">
                          <TechBullet />
                          <span className="flex-1 min-w-0 text-[rgb(var(--base-color)/0.86)] text-[14.72px] font-normal leading-[1.65] tracking-[0.05px]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex gap-[10px] items-start">
                      <TechBullet />
                      <p className="m-0 flex-1 text-[rgb(var(--base-color)/0.84)] text-[14.72px] leading-[1.65] tracking-[0.05px]">{node.myRoleText}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        ) : (
          /* Technical Support Blueprint (NCII / Internship) */
          <>
            {/* Overview */}
            {node.overviewText && (
              <section className="rem-sc f-col bg-[rgb(var(--base-color)/0.015)] p-[18px] md:p-[22px] rounded-[6px] border border-[rgb(var(--base-color)/0.06)]">
                <div className="f-y-center gap-[7.2px] border-b border-dashed border-[rgb(var(--base-color)/0.12)] pb-2 mb-[12px]">
                  <p className="m-0 text-[rgb(var(--base-color)/0.88)] text-[12.16px] font-bold tracking-[0.1em] uppercase">Overview</p>
                </div>
                <p className="m-0 text-[rgb(var(--base-color)/0.84)] text-[14.72px] leading-[1.68] tracking-[0.05px]">{node.overviewText}</p>
              </section>
            )}

            {/* What I Learned (NCII) / What I Did (Internship) */}
            {((node.whatILearned && node.whatILearned.length > 0) || (node.whatIDid && node.whatIDid.length > 0)) && (
              <section className="rem-sc f-col bg-[rgb(var(--base-color)/0.02)] p-[18px] md:p-[22px] rounded-[6px] border border-[rgb(var(--base-color)/0.08)]">
                <div className="f-y-center gap-[7.2px] border-b border-dashed border-[rgb(var(--base-color)/0.12)] pb-2 mb-[12px]">
                  <p className="m-0 text-[rgb(var(--base-color)/0.88)] text-[12.16px] font-bold tracking-[0.1em] uppercase">
                    {node.id === 'nc2-certificate' ? 'What I Learned' : 'What I Did'}
                  </p>
                </div>
                <div className="flex-1">
                  <ul className="list-none pl-0 space-y-[8px]" aria-label={node.id === 'nc2-certificate' ? 'What I learned' : 'What I did'}>
                    {(node.whatILearned || node.whatIDid)?.map((item, idx) => (
                      <li key={idx} className="flex gap-[10px] items-start">
                        <TechBullet />
                        <span className="flex-1 min-w-0 text-[rgb(var(--base-color)/0.86)] text-[14.72px] font-normal leading-[1.65] tracking-[0.05px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Key Takeaways (NCII) / What I Gained (Internship) */}
            {((node.keyTakeaways && node.keyTakeaways.length > 0) || (node.whatIGained && node.whatIGained.length > 0)) && (
              <section className="rem-sc f-col bg-[rgb(var(--base-color)/0.03)] p-[18px] md:p-[22px] rounded-[6px] border border-[rgb(var(--base-color)/0.1)]">
                <div className="f-y-center gap-[7.2px] border-b border-dashed border-[rgb(var(--base-color)/0.12)] pb-2 mb-[12px]">
                  <p className="m-0 text-[rgb(var(--base-color)/0.88)] text-[12.16px] font-bold tracking-[0.1em] uppercase">
                    {node.id === 'nc2-certificate' ? 'Key Takeaways' : 'What I Gained'}
                  </p>
                </div>
                <div className="flex-1">
                  <ul className="list-none pl-0 space-y-[8px]" aria-label={node.id === 'nc2-certificate' ? 'Key takeaways' : 'What I gained'}>
                    {(node.keyTakeaways || node.whatIGained)?.map((item, idx) => (
                      <li key={idx} className="flex gap-[10px] items-start">
                        <TechBullet />
                        <span className="flex-1 min-w-0 text-[rgb(var(--base-color)/0.86)] text-[14.72px] font-normal leading-[1.65] tracking-[0.05px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function RelevantExperienceModal({
  node,
  childNodes,
  onSelectNode,
  onClose,
}: RelevantExperienceModalProps) {
  const [activeNode, setActiveNode] = useState<RelevantExperienceNode | null>(null);
  const [activeChildNodes, setActiveChildNodes] = useState<RelevantExperienceNode[]>([]);

  useEffect(() => {
    if (node) {
      setActiveNode(node);
      setActiveChildNodes(childNodes);
    }
  }, [node, childNodes]);

  useEffect(() => {
    if (node) {
      globalLenis.stop();
      return () => {
        globalLenis.start();
      };
    }
  }, [node]);

  if (!activeNode) return null;

  const isParentNode = activeNode.type === 'parent';

  return (
    <ModalOverlay
      isOpen={!!node}
      onClose={onClose}
      backdrop={<div className="rem-od absolute inset-0" />}
      variant="fade"
    >
      <div
        className="fixed inset-0 z-[140] f-xy-center overflow-hidden overscroll-contain
         p-4 md:p-6"
        onClick={onClose}
      >
        <div
          className="rem-dd content-width relative z-[1] f-col w-full max-h-[min(88vh,928px)] overflow-visible leading-snug"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`rem-hd sticky top-0 z-10 f-y-center justify-between w-full px-4 sm:px-5 ${isParentNode ? 'py-4 sm:py-5' : 'py-4 sm:py-5'}`}>
            <div className="min-w-0 mr-10">
              <h3 className="font-anta my-[2px] tracking-[1px] rem-hmtd
               text-[25px] md:text-[30px]">
                {activeNode.title}
              </h3>
              {activeNode.subtitle && (
                <p className="text-[rgb(var(--base-color)/0.62)] tracking-[1px] uppercase 
                 text-[12px] md:text-[13px]">{activeNode.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              className="group rem-cbd shrink-0 hidden sm:inline-flex"
              aria-label="Close modal"
              onClick={onClose}
            >
              <AnimatedCloseIcon size={25} strokeWidth={1.5} />
            </button>
          </div>

          <div 
            data-lenis-prevent
            className="rem-bsc flex-auto min-h-0 overflow-y-auto p-4 sm:p-5"
          >
            {isParentNode ? (
              <ParentModalBody
                node={activeNode}
                childNodes={activeChildNodes}
                onSelectNode={onSelectNode}
              />
            ) : (
              <ChildModalBody node={activeNode} />
            )}

            {/* Mobile bottom close button */}
            <div className="mt-6 sm:hidden">
              <button
                type="button"
                className="w-full py-3.5 rounded-[4px] border border-dashed border-[rgb(var(--base-color)/0.3)] 
                  bg-[rgb(var(--base-color)/0.03)] hover:bg-[rgb(var(--base-color)/0.08)]
                  text-[rgb(var(--base-color)/0.85)] font-anta tracking-[4px] text-center text-[12px]
                  cursor-pointer transition-all duration-200 uppercase"
                onClick={onClose}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

export default function RelevantExperiences() {
  const laneRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(MIN_CANVAS_WIDTH);
  const [modalNodeId, setModalNodeId] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === 'undefined' ? 1024 : window.innerWidth
  );

  useEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setCanvasWidth(entry.contentRect.width);
        setViewportWidth(window.innerWidth);
      }
    });
    resizeObserver.observe(lane);
    return () => resizeObserver.disconnect();
  }, []);

  const { nodes, connections } = useMemo(() => {
    const baseNodes = relevantExperiencesContentData.nodes;
    const baseConnections = relevantExperiencesContentData.connections;

    if (viewportWidth >= 1024) {
      return { nodes: baseNodes, connections: baseConnections };
    } else if (viewportWidth >= 768) {
      const mdLayout = relevantExperiencesContentData.mdLayout;
      if (!mdLayout) return { nodes: baseNodes, connections: baseConnections };

      const mdNodesMap = new Map(mdLayout.nodes.map((n) => [n.id, n.layout]));
      const updatedNodes = baseNodes.map((node) => ({
        ...node,
        layout: mdNodesMap.get(node.id)
          ? { ...node.layout, ...mdNodesMap.get(node.id) }
          : node.layout,
      }));
      return { nodes: updatedNodes, connections: mdLayout.connections };
    }
    return { nodes: baseNodes, connections: [] };
  }, [viewportWidth]);

  const layoutMode = viewportWidth >= 768 ? 'desktop' : 'linear';
  const canvasHeight = useMemo(() => resolveCanvasHeight(nodes), [nodes]);

  const activeCanvasWidth = useMemo(() => {
    if (viewportWidth >= 1024) return MIN_CANVAS_WIDTH;
    if (viewportWidth >= 768) return 760;
    // Fallback for mobile/linear viewports where canvas width is not used
    return MIN_CANVAS_WIDTH;
  }, [viewportWidth]);

  const scale = useMemo(() => {
    const availableWidth = canvasWidth - 8;
    if (!availableWidth || availableWidth >= activeCanvasWidth) return 1;
    return availableWidth / activeCanvasWidth;
  }, [canvasWidth, activeCanvasWidth]);

  const parentNodes = useMemo(
    () =>
      nodes
        .filter((n) => n.type === 'parent')
        .sort((a, b) => a.layout.y - b.layout.y || a.layout.x - b.layout.x),
    [nodes]
  );

  const childNodesByParentId = useMemo(() => {
    const grouped = new Map<string, RelevantExperienceNode[]>();
    parentNodes.forEach((p) => grouped.set(p.id, []));
    nodes
      .filter((n) => n.type === 'child')
      .forEach((child) => {
        if (child.parentId && grouped.has(child.parentId)) {
          grouped.get(child.parentId)?.push(child);
        }
      });
    return grouped;
  }, [nodes, parentNodes]);

  const modalNode = useMemo(
    () => nodes.find((n) => n.id === modalNodeId) ?? null,
    [modalNodeId, nodes]
  );
  const childNodesForModal = useMemo(
    () =>
      modalNode?.type === 'parent' ? childNodesByParentId.get(modalNode.id) ?? [] : [],
    [modalNode, childNodesByParentId]
  );

  return (
    <>
      <section className="grid-background gb--bottom-border gb--top-border relative z-10">
        <div className="f-col-y-center min-h-screen content-width py-24">
          <div className="text-center w-full">
            <h2 className="font-anta re-tt text-center leading-[50px] tracking-[0.2px] 
             text-[45px] sm:text-[47px] md:text-[55px] 
             mt-[22px] sm:mt-[26px] md:mt-0 
             mb-[30px] sm:mb-[40px] md:mb-[60px]">Relevant Experiences</h2>
          </div>
          <div ref={laneRef} className="relative w-full mt-10">
            {layoutMode === 'desktop' ? (
              <div
                style={{
                  height: canvasHeight * scale + 8,
                  overflow: 'hidden',
                  padding: '4px',
                }}
              >
                <div
                  style={{
                    width: activeCanvasWidth,
                    height: canvasHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    position: 'relative',
                  }}
                >
                  <RelevantExperienceConnections
                    canvasHeight={canvasHeight}
                    canvasWidth={activeCanvasWidth}
                    connections={connections}
                    nodes={nodes}
                  />
                  {nodes.map((node) => (
                    <div
                      key={node.id}
                      className="rec-hw absolute z-10 overflow-visible box-border cursor-pointer"
                      style={{
                        left: `${node.layout.x}px`,
                        top: `${node.layout.y}px`,
                        width: `${node.layout.width}px`,
                        height: `${node.layout.height}px`,
                      }}
                      onClick={() => setModalNodeId(node.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.title} card`}
                      onKeyDown={onKeyActivate(() => setModalNodeId(node.id))}
                    >
                      {node.type === 'parent' ? (
                        <ParentCardContent parent={node} />
                      ) : (
                        <ChildCardContent child={node} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="f-col re-lm max-md:gap-[80px]">
                {parentNodes.map((parent) => {
                  const children = childNodesByParentId.get(parent.id) ?? [];
                  return (
                    <section key={parent.id} className="re-gn relative">
                      <div
                        className="rec-hw relative z-[1] overflow-visible box-border cursor-pointer w-full max-w-none min-h-full"
                        role="button"
                        tabIndex={0}
                        aria-label={`${parent.title} card`}
                        onClick={() => setModalNodeId(parent.id)}
                        onKeyDown={onKeyActivate(() => setModalNodeId(parent.id))}
                      >
                        <ParentCardContent parent={parent} />
                      </div>
                      {children.length > 0 && (
                        <div className="grid grid-cols-1 gap-10 mt-10">
                          {children.map((child) => (
                            <div
                              key={child.id}
                              className="re-cn rec-hw relative z-[1] overflow-visible box-border cursor-pointer w-full min-w-0"
                              role="button"
                              tabIndex={0}
                              aria-label={`${child.title} card`}
                              onClick={() => setModalNodeId(child.id)}
                              onKeyDown={onKeyActivate(() => setModalNodeId(child.id))}
                            >
                              <ChildCardContent child={child} />
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      <RelevantExperienceModal
        node={modalNode}
        childNodes={childNodesForModal}
        onSelectNode={setModalNodeId}
        onClose={() => setModalNodeId(null)}
      />
    </>
  );
}