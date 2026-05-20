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
    <article className="relevant-experiences-card__surface relevant-experiences-card__surface--framed relevant-experiences-card__surface--glass relevant-experiences-card__surface--parent journey-map-card journey-showcase__card journey-showcase__card--parent">
      <div className="journey-map-card__parent-header">
        {parent.icon && (
          <div className="journey-map-card__icon-shell">
            {parent.icon === 'briefcase-business' ? (
              <BriefcaseBusiness className="journey-map-card__icon" strokeWidth={1.3} />
            ) : (
              <FolderKanban className="journey-map-card__icon" strokeWidth={1.3} />
            )}
          </div>
        )}
        <h3 className="journey-map-card__title">{parent.title}</h3>
      </div>
      <p className="journey-map-card__details text-sm leading-relaxed">{parent.details}</p>
    </article>
  );
}

function ChildCardContent({ child }: { child: RelevantExperienceNode }) {
  const isBounce = child.logoAnimation === 'bounce';
  return (
    <article className="relevant-experiences-card__surface relevant-experiences-card__surface--framed relevant-experiences-card__surface--glass relevant-experiences-card__surface--child journey-map-card journey-showcase__card journey-showcase__card--child">
      {child.image && (
        <GlassCard
          width="w-full"
          corner="rounded-[2px]"
          shadow=""
          className="overflow-hidden journey-map-card__media"
        >
          {isBounce ? (
            <BouncingLogoDisplay
              src={`${import.meta.env.BASE_URL}${child.image}`}
              alt={child.title}
              className="relevant-experiences-modal__dvd-shell--preview"
              logoClassName="relevant-experiences-modal__dvd-logo--preview"
            />
          ) : (
            <img
              src={`${import.meta.env.BASE_URL}${child.image}`}
              alt={child.title}
              className="journey-map-card__image"
              loading="lazy"
              draggable={false}
            />
          )}
        </GlassCard>
      )}
      <div className="relevant-experiences-card__body">
        <h4 className="journey-map-card__child-title">{child.title}</h4>
        <p className="journey-map-card__child-details">{child.details}</p>
        {child.previewTags && child.previewTags.length > 0 && (
          <div className="relevant-experiences-card__tags" aria-label={`${child.title} tags`}>
            {child.previewTags.map((tag) => (
              <span key={tag} className="relevant-experiences-card__tag">
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
    <div className="flex flex-col gap-6">
      <section className="relevant-experiences-modal__section relevant-experiences-modal__section--parent-intro">
        <div className="relevant-experiences-modal__section-header">
          <p className="relevant-experiences-modal__label relevant-experiences-modal__label--primary">
            Overview
          </p>
        </div>
        <p className="relevant-experiences-modal__intro">{node.details}</p>
      </section>

      <section className="relevant-experiences-modal__section">
        <div className="relevant-experiences-modal__section-header">
          <p className="relevant-experiences-modal__label relevant-experiences-modal__label--primary">
            Included Work
          </p>
        </div>
        {childNodes.length > 0 && (
          <div className="relevant-experiences-modal__child-grid">
            {childNodes.map((child) => (
              <button
                key={child.id}
                type="button"
                className="relevant-experiences-modal__child-card"
                onClick={() => onSelectNode(child.id)}
              >
                <div className="relevant-experiences-modal__child-card-copy">
                  <h4 className="relevant-experiences-modal__child-card-title">
                    {child.title}
                  </h4>
                  <p className="relevant-experiences-modal__child-card-details">
                    {child.details}
                  </p>
                  {child.previewTags && child.previewTags.length > 0 && (
                    <div className="relevant-experiences-modal__child-card-tags">
                      {child.previewTags.map((tag) => (
                        <span key={tag} className="relevant-experiences-card__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="relevant-experiences-modal__child-card-hint">
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
    <div className="flex flex-col gap-6">
      {node.image && (
        <section className="relevant-experiences-modal__section">
          <GlassCard
            width="w-full"
            corner="rounded-[3px]"
            shadow=""
            className="overflow-hidden relevant-experiences-modal__media"
          >
            {isBounce ? (
              <BouncingLogoDisplay src={`${import.meta.env.BASE_URL}${node.image}`} alt={node.title} />
            ) : (
              <img
                src={`${import.meta.env.BASE_URL}${node.image}`}
                alt={node.title}
                className="relevant-experiences-modal__image"
                loading="lazy"
                draggable={false}
              />
            )}
          </GlassCard>
        </section>
      )}

      {node.companyDescription && (
        <section className="relevant-experiences-modal__section">
          <div className="relevant-experiences-modal__section-header">
            <p className="relevant-experiences-modal__label">About the Company</p>
          </div>
          <p className="relevant-experiences-modal__desc">{node.companyDescription}</p>
        </section>
      )}

      <div className="relevant-experiences-modal__content-grid">
        {node.modalWhatIDid && node.modalWhatIDid.length > 0 && (
          <section className="relevant-experiences-modal__section flex flex-col h-full">
            <div className="relevant-experiences-modal__section-header">
              <p className="relevant-experiences-modal__label">What I Did</p>
            </div>
            <div className="relevant-experiences-modal__list-box flex-1">
              <ul className="relevant-experiences-modal__list" aria-label={`What I did in ${node.title}`}>
                {node.modalWhatIDid.map((item, idx) => (
                  <li key={idx} className="relevant-experiences-modal__list-item">
                    <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                    <span className="relevant-experiences-modal__list-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {node.keyContentTitle && node.keyContent && (
          <section className="relevant-experiences-modal__section flex flex-col h-full">
            <div className="relevant-experiences-modal__section-header">
              <p className="relevant-experiences-modal__label">{node.keyContentTitle}</p>
            </div>
            <div className="relevant-experiences-modal__list-box flex-1">
              {Array.isArray(node.keyContent) ? (
                <ul className="relevant-experiences-modal__list" aria-label={`${node.keyContentTitle} of ${node.title}`}>
                  {node.keyContent.map((item, idx) => (
                    <li key={idx} className="relevant-experiences-modal__list-item">
                      <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                      <span className="relevant-experiences-modal__list-text">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="relevant-experiences-modal__takeaway">{node.keyContent}</p>
              )}
            </div>
          </section>
        )}
      </div>

      {node.modalTags && node.modalTags.length > 0 && (
        <section className="relevant-experiences-modal__section">
          <div className="relevant-experiences-modal__section-header">
            <p className="relevant-experiences-modal__label">Tags</p>
          </div>
          <div className="relevant-experiences-modal__tags">
            {node.modalTags.map((tag) => (
              <span key={tag} className="relevant-experiences-card__tag">
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
      backdrop={<div className="relevant-experiences-modal__backdrop" />}
    >
      <div className="relevant-experiences-modal" onClick={onClose}>
        <div
          ref={scrollRef}
          className="relevant-experiences-modal__dialog text-[17px] leading-snug"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="relevant-experiences-modal__header">
              <div className="relevant-experiences-modal__header-copy">
                <h3 className="relevant-experiences-modal__title font-anta">
                  {node.title}
                </h3>
                {node.subtitle && (
                  <p className="relevant-experiences-modal__subtitle">{node.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                className="group relevant-experiences-modal__close"
                aria-label="Close modal"
                onClick={onClose}
              >
                <AnimatedCloseIcon size={18} strokeWidth={1.8} />
              </button>
            </div>

            <div className="relevant-experiences-modal__body">
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
      <section className="grid-background gb--bottom-border gb--top-border relative z-10 text-[rgb(247,247,217)]">
        <div className="f-col-y-center min-h-screen content-width py-24">
          <div className="text-center w-full">
            <h2 className="font-anta relevant-experiences-intro__title text-center">Relevant Experiences</h2>
          </div>
          <div ref={laneRef} className="relevant-experiences-map w-full mt-10">
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
                      className={`relevant-experiences-card relevant-experiences-card--${node.type} relevant-experiences-card--interactive`}
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
              <div className="relevant-experiences-responsive relevant-experiences-responsive--linear">
                {parentNodes.map((parent) => {
                  const children = childNodesByParentId.get(parent.id) ?? [];
                  return (
                    <section key={parent.id} className="relevant-experiences-group">
                      <div
                        className="relevant-experiences-group__parent relevant-experiences-card-shell relevant-experiences-card-shell--interactive"
                        role="button"
                        tabIndex={0}
                        aria-label={`${parent.title} card`}
                        onClick={() => setModalNodeId(parent.id)}
                        onKeyDown={onKeyActivate(() => setModalNodeId(parent.id))}
                      >
                        <ParentCardContent parent={parent} />
                      </div>
                      {children.length > 0 && (
                        <div className="relevant-experiences-group__children relevant-experiences-group__children--linear">
                          {children.map((child) => (
                            <div
                              key={child.id}
                              className="relevant-experiences-responsive-card relevant-experiences-responsive-card--child relevant-experiences-card-shell relevant-experiences-card-shell--interactive"
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