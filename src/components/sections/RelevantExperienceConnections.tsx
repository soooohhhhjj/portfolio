import { useMemo } from 'react';
import type {
  RelevantExperienceConnection,
  RelevantExperienceNode,
  RelevantExperienceConnectionPoint,
} from '../../types/relevantExperiences';

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

export default function RelevantExperienceConnections({
  canvasWidth,
  canvasHeight,
  connections,
  nodes,
}: RelevantExperienceConnectionsProps) {
  const nodesById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <svg
      className="re-csvg"
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
            className={`re-cln re-cln--${conn.variant === 'group' ? 'gn' : 'dn'}`}
          />
        );
      })}
    </svg>
  );
}
