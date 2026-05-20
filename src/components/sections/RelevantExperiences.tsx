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
  RelevantExperienceConnection,
} from '../../types/relevantExperiences';
import './RelevantExperiences.css';

const MIN_CANVAS_WIDTH = 930;
const MIN_CANVAS_HEIGHT = 0;

function resolveCanvasHeight(nodes: RelevantExperienceNode[]) {
  const furthestBottom = nodes.reduce(
    (maxBottom, node) => Math.max(maxBottom, node.layout.y + node.layout.height),
    0
  );
  return Math.max(MIN_CANVAS_HEIGHT, furthestBottom);
}

type RelevantExperienceConnectionPoint = { x: number; y: number };

function getAnchorPoint(
  node: RelevantExperienceNode,
  anchor: 'top' | 'right' | 'bottom' | 'left'
): RelevantExperienceConnectionPoint {
  const { x, y, width, height } = node.layout;
  switch (anchor) {
    case 'top':
      return { x: x + width / 2, y };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
  }
}

function buildConnectionPath(
  connection: RelevantExperienceConnection,
  nodesById: Map<string, RelevantExperienceNode>
): string {
  const fromNode = nodesById.get(connection.from);
  const toNode = nodesById.get(connection.to);
  if (!fromNode || !toNode) return '';

  const points = [
    getAnchorPoint(fromNode, connection.fromAnchor),
    ...connection.viaPoints,
    getAnchorPoint(toNode, connection.toAnchor),
  ];

  return points.reduce(
    (path, point, index) => `${path}${index === 0 ? 'M' : ' L'} ${point.x} ${point.y}`,
    ''
  );
}

interface RelevantExperienceConnectionsProps {
  canvasWidth: number;
  canvasHeight: number;
  connections: RelevantExperienceConnection[];
  nodes: RelevantExperienceNode[];
}

function RelevantExperienceConnections({
  canvasWidth,
  canvasHeight,
  connections,
  nodes,
}: RelevantExperienceConnectionsProps) {
  const nodesById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <svg
      className="relevant-experiences-connections"
      width={canvasWidth}
      height={canvasHeight}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {connections.map((conn) => {
        const path = buildConnectionPath(conn, nodesById);
        if (!path) return null;
        return (
          <path
            key={conn.id}
            d={path}
            className={`relevant-experiences-connection relevant-experiences-connection--${conn.variant}`}
          />
        );
      })}
    </svg>
  );
}

function BouncingLogoDisplay({
  src,
  alt,
  className,
  logoClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  logoClassName?: string;
}) {
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0.07, y: 0.065 });
  const boundsRef = useRef({ width: 0, height: 0, logoWidth: 0, logoHeight: 0 });
  const shellRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const logo = logoRef.current;
    if (!shell || !logo) return;

    const updateBounds = () => {
      const nextBounds = {
        width: shell.clientWidth,
        height: shell.clientHeight,
        logoWidth: logo.clientWidth,
        logoHeight: logo.clientHeight,
      };
      boundsRef.current = nextBounds;
      positionRef.current = {
        x: Math.max(0, Math.min(positionRef.current.x, nextBounds.width - nextBounds.logoWidth)),
        y: Math.max(0, Math.min(positionRef.current.y, nextBounds.height - nextBounds.logoHeight)),
      };
      logo.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    };

    const step = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const delta = Math.min(32, time - lastTimeRef.current);
      lastTimeRef.current = time;

      const { width, height, logoWidth, logoHeight } = boundsRef.current;
      const maxX = Math.max(0, width - logoWidth);
      const maxY = Math.max(0, height - logoHeight);

      if (maxX > 0 || maxY > 0) {
        let nextX = positionRef.current.x + velocityRef.current.x * delta;
        let nextY = positionRef.current.y + velocityRef.current.y * delta;

        if (nextX <= 0 || nextX >= maxX) {
          velocityRef.current.x *= -1;
          nextX = Math.max(0, Math.min(nextX, maxX));
        }
        if (nextY <= 0 || nextY >= maxY) {
          velocityRef.current.y *= -1;
          nextY = Math.max(0, Math.min(nextY, maxY));
        }

        positionRef.current = { x: nextX, y: nextY };
        logo.style.transform = `translate(${nextX}px, ${nextY}px)`;
      }

      frameRef.current = window.requestAnimationFrame(step);
    };

    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(shell);
    resizeObserver.observe(logo);
    updateBounds();
    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      lastTimeRef.current = null;
    };
  }, []);

  return (
    <div ref={shellRef} className={`relevant-experiences-modal__dvd-shell ${className ?? ''}`}>
      <img
        ref={logoRef}
        src={src}
        alt={alt}
        className={`relevant-experiences-modal__dvd-logo ${logoClassName ?? ''}`}
        loading="lazy"
        draggable={false}
      />
    </div>
  );
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
        <h3 className="journey-map-card__title font-jura">{parent.title}</h3>
      </div>
      <p className="journey-map-card__details font-jura text-sm leading-relaxed">{parent.details}</p>
    </article>
  );
}

function ChildCardContent({ child }: { child: RelevantExperienceNode }) {
  const isTransferItNode = child.id === 'transfer-it-internship';
  return (
    <article className="relevant-experiences-card__surface relevant-experiences-card__surface--framed relevant-experiences-card__surface--glass relevant-experiences-card__surface--child journey-map-card journey-showcase__card journey-showcase__card--child">
      {child.image && (
        <GlassCard
          width="w-full"
          corner="rounded-[2px]"
          shadow=""
          className="overflow-hidden journey-map-card__media"
        >
          {isTransferItNode ? (
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
        <h4 className="journey-map-card__child-title font-jura">{child.title}</h4>
        <p className="journey-map-card__child-details font-jura">{child.details}</p>
        {child.previewTags && child.previewTags.length > 0 && (
          <div className="relevant-experiences-card__tags" aria-label={`${child.title} tags`}>
            {child.previewTags.map((tag) => (
              <span key={tag} className="relevant-experiences-card__tag font-jura">
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

function RelevantExperienceModal({
  node,
  childNodes,
  onSelectNode,
  onClose,
}: RelevantExperienceModalProps) {
  const scrollRef = useModalLenis(!!node);

  if (!node) return null;

  const isParentNode = node.type === 'parent';
  const isTransferItNode = node.id === 'transfer-it-internship';

  return (
    <ModalOverlay
      isOpen={!!node}
      onClose={onClose}
      backdrop={<div className="relevant-experiences-modal__backdrop" />}
    >
      <div className="relevant-experiences-modal" onClick={onClose}>
        <div
          ref={scrollRef}
          className="relevant-experiences-modal__dialog font-jura text-[17px] leading-snug"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
          <div className="relevant-experiences-modal__header">
            <div className="relevant-experiences-modal__header-copy">
              <h3 className="relevant-experiences-modal__title font-anta">
                {node.title}
              </h3>
              {node.subtitle && (
                <p className="relevant-experiences-modal__subtitle font-jura">{node.subtitle}</p>
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
              <div className="flex flex-col gap-6">
                <section className="relevant-experiences-modal__section relevant-experiences-modal__section--parent-intro">
                  <div className="relevant-experiences-modal__section-header">
                    <p className="relevant-experiences-modal__label relevant-experiences-modal__label--primary font-jura">
                      Overview
                    </p>
                  </div>
                  <p className="relevant-experiences-modal__intro font-jura">{node.details}</p>
                </section>

                <section className="relevant-experiences-modal__section">
                  <div className="relevant-experiences-modal__section-header">
                    <p className="relevant-experiences-modal__label relevant-experiences-modal__label--primary font-jura">
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
                            <h4 className="relevant-experiences-modal__child-card-title font-jura">
                              {child.title}
                            </h4>
                            <p className="relevant-experiences-modal__child-card-details font-jura">
                              {child.details}
                            </p>
                            {child.previewTags && child.previewTags.length > 0 && (
                              <div className="relevant-experiences-modal__child-card-tags">
                                {child.previewTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="relevant-experiences-card__tag font-jura"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="relevant-experiences-modal__child-card-hint font-jura">
                            Open
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {node.image && (
                  <section className="relevant-experiences-modal__section">
                    <GlassCard
                      width="w-full"
                      corner="rounded-[3px]"
                      shadow=""
                      className="overflow-hidden relevant-experiences-modal__media"
                    >
                      {isTransferItNode ? (
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

                {isTransferItNode && (
                  <section className="relevant-experiences-modal__section">
                    <div className="relevant-experiences-modal__section-header">
                      <p className="relevant-experiences-modal__label relevant-experiences-modal__label--primary font-jura">
                        About the Company
                      </p>
                    </div>
                    <p className="relevant-experiences-modal__intro font-jura">
                      Transfer IT is a printing and design company specializing in custom transfers for apparel and merchandise. During my 209-hour internship, I supported IT operations and explored AI tools for creative workflows.
                    </p>
                  </section>
                )}

                <div className="relevant-experiences-modal__content-grid">
                  {(node.id === 'system-architecture-thesis' ||
                    node.id === 'capstone-thesis') && (
                    <section className="relevant-experiences-modal__section relevant-experiences-modal__section--full-width">
                      <div className="relevant-experiences-modal__section-header">
                        <p className="relevant-experiences-modal__label relevant-experiences-modal__label--primary font-jura">
                          Overview
                        </p>
                      </div>
                      <p className="relevant-experiences-modal__intro font-jura">{node.details}</p>
                    </section>
                  )}

                  {node.modalWhatIDid && node.modalWhatIDid.length > 0 && (
                    <section className="relevant-experiences-modal__section relevant-experiences-modal__section--column">
                      <div className="relevant-experiences-modal__section-header">
                        <p className="relevant-experiences-modal__label relevant-experiences-modal__label--primary font-jura">
                          {node.id === 'system-architecture-thesis' ||
                          node.id === 'capstone-thesis'
                            ? 'Responsibilities'
                            : 'What I Did'}
                        </p>
                      </div>
                      <ul className="relevant-experiences-modal__list">
                        {node.modalWhatIDid.map((item, index) => (
                          <li
                            key={index}
                            className="relevant-experiences-modal__list-item font-jura"
                          >
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section className="relevant-experiences-modal__section relevant-experiences-modal__section--column">
                    <div className="relevant-experiences-modal__section-header">
                      <p className="relevant-experiences-modal__label relevant-experiences-modal__label--primary font-jura">
                        {node.id === 'nc2-certificate' || node.id === 'transfer-it-internship'
                          ? 'Key Takeaway'
                          : 'Key Features'}
                      </p>
                    </div>
                    <div className="relevant-experiences-modal__key-content mt-2">
                      {node.id === 'nc2-certificate' && (
                        <p className="relevant-experiences-modal__intro font-jura p-0">
                          Developed foundational hardware servicing skills through hands-on practice, building confidence in PC troubleshooting and basic network configuration.
                        </p>
                      )}
                      {node.id === 'transfer-it-internship' && (
                        <p className="relevant-experiences-modal__intro font-jura p-0">
                          Gained practical IT support experience in a real office environment, learning to manage issues systematically and communicate with cross-functional teams.
                        </p>
                      )}
                      {node.id === 'system-architecture-thesis' && (
                        <ul className="relevant-experiences-modal__list">
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">Inventory CRUD operations</span>
                          </li>
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">Real-time stock tracking dashboard</span>
                          </li>
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">User authentication and role management</span>
                          </li>
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">Audit trail for inventory changes</span>
                          </li>
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">Space-themed glassmorphism UI</span>
                          </li>
                        </ul>
                      )}
                      {node.id === 'capstone-thesis' && (
                        <ul className="relevant-experiences-modal__list">
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">Payment tracking automation</span>
                          </li>
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">Contribution status monitoring</span>
                          </li>
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">GCash integration for classroom funds</span>
                          </li>
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">Real-time payment verification</span>
                          </li>
                          <li className="relevant-experiences-modal__list-item font-jura">
                            <span className="relevant-experiences-modal__list-bullet">&bull;</span>
                            <span className="relevant-experiences-modal__list-text">Secure user authentication</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </section>
                </div>

                {node.modalTags && node.modalTags.length > 0 && (
                  <section className="relevant-experiences-modal__section">
                    <div className="relevant-experiences-modal__section-header">
                      <p className="relevant-experiences-modal__label font-jura">Tags</p>
                    </div>
                    <div className="relevant-experiences-modal__tags">
                      {node.modalTags.map((tag) => (
                        <span key={tag} className="relevant-experiences-card__tag font-jura">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
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
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(MIN_CANVAS_WIDTH);
  const [modalNodeId, setModalNodeId] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window === 'undefined' ? 1024 : window.innerWidth
  );

  useEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;
    const resizeObserver = new ResizeObserver((entries) => {
      setCanvasWidth(entries[0]?.contentRect.width ?? MIN_CANVAS_WIDTH);
    });
    resizeObserver.observe(lane);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    if (viewportWidth >= 768) return 730;
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

  const handleActivateNode = (nodeId: string) => setModalNodeId(nodeId);
  const handleCloseModal = () => setModalNodeId(null);

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
                  ref={canvasRef}
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
                      onClick={() => handleActivateNode(node.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.title} card`}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleActivateNode(node.id);
                        }
                      }}
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
                        onClick={() => handleActivateNode(parent.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleActivateNode(parent.id);
                          }
                        }}
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
                              onClick={() => handleActivateNode(child.id)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  handleActivateNode(child.id);
                                }
                              }}
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
        onClose={handleCloseModal}
      />
    </>
  );
}