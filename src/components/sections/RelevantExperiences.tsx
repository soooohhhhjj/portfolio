// src/components/sections/RelevantExperiences.tsx
import { useState, useEffect, useMemo, useRef } from 'react';
import { BriefcaseBusiness, FolderKanban } from 'lucide-react';
import { AnimatedCloseIcon } from '../ui/AnimatedCloseIcon';
import { GlassCard } from '../ui/GlassCard';
import { ModalOverlay } from '../ui/ModalOverlay';
import { useModalLenis } from '../../hooks/useModalLenis';
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

function ChildModalBody({ node }: { node: RelevantExperienceNode }) {
  const isBounce = node.logoAnimation === 'bounce';

  return (
    <div className="f-col gap-6">
      {node.image && (
        <section className="rem-sc">
          <GlassCard
            width="w-full"
            corner="rounded-[3px]"
            shadow=""
            className="overflow-hidden rem-mwd"
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
        <section className="rem-sc">
          <div className="f-y-center gap-[7.2px]">
            <p className="m-0 text-[rgb(var(--base-color)/0.56)] text-[11.52px] font-semibold tracking-[0.08em] uppercase">About the Company</p>
          </div>
          <p className="mt-[9.6px] pl-2 text-[rgb(var(--base-color)/0.84)] text-[15.68px] leading-[1.78] tracking-[0.08px]">{node.companyDescription}</p>
        </section>
      )}

      <div className="grid grid-cols-1 gap-5
       md:grid-cols-2 md:gap-6">
        {node.modalWhatIDid && node.modalWhatIDid.length > 0 && (
          <section className="rem-sc f-col h-full">
            <div className="f-y-center gap-[7.2px]">
              <p className="m-0 text-[rgb(var(--base-color)/0.56)] text-[11.52px] font-semibold tracking-[0.08em] uppercase">What I Did</p>
            </div>
            <div className="mt-[7.2px] ml-2 pl-0 flex-1">
              <ul className="list-none pl-0 space-y-[4.48px]" aria-label={`What I did in ${node.title}`}>
                {node.modalWhatIDid.map((item, idx) => (
                  <li key={idx} className="flex gap-[6.72px] items-start">
                    <span className="shrink-0 mt-[0.32px] text-[rgb(var(--base-color)/0.7)] text-base leading-[1.5]">&bull;</span>
                    <span className="flex-1 min-w-0 text-[rgb(var(--base-color)/0.86)] text-[15.36px] font-normal leading-[1.72] tracking-[0.1px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {node.keyContentTitle && node.keyContent && (
          <section className="rem-sc f-col h-full">
            <div className="f-y-center gap-[7.2px]">
              <p className="m-0 text-[rgb(var(--base-color)/0.56)] text-[11.52px] font-semibold tracking-[0.08em] uppercase">{node.keyContentTitle}</p>
            </div>
            <div className="mt-[7.2px] ml-2 pl-0 flex-1">
              {Array.isArray(node.keyContent) ? (
                <ul className="list-none pl-0 space-y-[4.48px]" aria-label={`${node.keyContentTitle} of ${node.title}`}>
                  {node.keyContent.map((item, idx) => (
                    <li key={idx} className="flex gap-[6.72px] items-start">
                      <span className="shrink-0 mt-[0.32px] text-[rgb(var(--base-color)/0.7)] text-base leading-[1.5]">&bull;</span>
                      <span className="flex-1 min-w-0 text-[rgb(var(--base-color)/0.86)] text-[15.36px] font-normal leading-[1.72] tracking-[0.1px]">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-[9.6px] pl-2 text-[rgb(var(--base-color)/0.84)] text-[15.68px] leading-[1.78] tracking-[0.08px]">{node.keyContent}</p>
              )}
            </div>
          </section>
        )}
      </div>

      {node.modalTags && node.modalTags.length > 0 && (
        <section className="rem-sc">
          <div className="f-y-center gap-[7.2px]">
            <p className="m-0 text-[rgb(var(--base-color)/0.56)] text-[11.52px] font-semibold tracking-[0.08em] uppercase">Tags</p>
          </div>
          <div className="flex flex-wrap gap-[5.6px] mt-[7.2px] ml-2">
            {node.modalTags.map((tag) => (
              <span key={tag} className="rec-td min-h-[24.8px] px-[9.92px] pt-[3.52px] pb-[2.88px] text-[11.52px] tracking-[0.12px]">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RelevantExperienceModal({
  node,
  childNodes,
  onSelectNode,
  onClose,
}: RelevantExperienceModalProps) {
  const scrollRef = useModalLenis(!!node);

  if (!node) return null;

  const isParentNode = node.type === 'parent';

  return (
    <ModalOverlay
      isOpen={!!node}
      onClose={onClose}
      backdrop={<div className="rem-od absolute inset-0" />}
    >
      <div
        className="fixed inset-0 z-[140] f-xy-center overflow-hidden overscroll-contain
         p-4 md:p-6"
        onClick={onClose}
      >
        <div
          ref={scrollRef}
          className="rem-dd relative z-[1] flex flex-col w-full max-h-[min(88vh,928px)] mx-auto overflow-hidden text-[17px] leading-snug
           min-[400px]:max-w-[360px] min-[480px]:max-w-[440px] sm:max-w-[576px] md:max-w-[760px] lg:max-w-[930px] xl:max-w-[930px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="rem-hd sticky top-0 z-10 flex items-end justify-between gap-4 w-full px-4 md:px-[22.4px] pt-[22.4px] pb-4">
              <div className="min-w-0 pt-[4px]">
                <h3 className="font-anta m-0 text-[20px] md:text-[24.8px] leading-[1.15] tracking-[0.2px]">
                  {node.title}
                </h3>
                {node.subtitle && (
                  <p className="mt-[5.6px] text-[rgb(var(--base-color)/0.62)] text-[13.12px] leading-[1.45] tracking-[0.06em] uppercase">{node.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                className="group rem-cbd"
                aria-label="Close modal"
                onClick={onClose}
              >
                <AnimatedCloseIcon size={18} strokeWidth={1.8} />
              </button>
            </div>

            <div className="rem-bsc flex-auto min-h-0 overflow-y-auto p-4 md:p-[22.4px]">
              {isParentNode ? (
                <ParentModalBody
                  node={node}
                  childNodes={childNodes}
                  onSelectNode={onSelectNode}
                />
              ) : (
                <ChildModalBody node={node} />
              )}
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
        key={modalNodeId ?? 'closed'}
        node={modalNode}
        childNodes={childNodesForModal}
        onSelectNode={setModalNodeId}
        onClose={() => setModalNodeId(null)}
      />
    </>
  );
}