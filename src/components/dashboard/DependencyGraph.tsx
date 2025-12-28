import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { mockPeople, mockModules, mockLinks } from "@/data/mockData";

interface DependencyGraphProps {
  onSelectPerson: (id: string) => void;
  onSelectModule: (id: string) => void;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  type: 'person' | 'module';
  label: string;
  risk: 'critical' | 'warning' | 'healthy';
  riskScore?: number;
}

export function DependencyGraph({ onSelectPerson, onSelectModule }: DependencyGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Generate node positions in a circular layout
  const generatePositions = useCallback((): NodePosition[] => {
    const positions: NodePosition[] = [];
    const centerX = 50;
    const centerY = 50;
    
    // People in outer ring
    const peopleRadius = 38;
    mockPeople.forEach((person, i) => {
      const angle = (i * 2 * Math.PI) / mockPeople.length - Math.PI / 2;
      positions.push({
        id: person.id,
        x: centerX + peopleRadius * Math.cos(angle),
        y: centerY + peopleRadius * Math.sin(angle),
        type: 'person',
        label: person.name.split(' ')[0],
        risk: person.riskScore >= 4 ? 'critical' : person.riskScore >= 3 ? 'warning' : 'healthy',
        riskScore: person.riskScore,
      });
    });

    // Modules in inner ring
    const moduleRadius = 18;
    mockModules.forEach((module, i) => {
      const angle = (i * 2 * Math.PI) / mockModules.length - Math.PI / 2 + Math.PI / mockModules.length;
      positions.push({
        id: module.id,
        x: centerX + moduleRadius * Math.cos(angle),
        y: centerY + moduleRadius * Math.sin(angle),
        type: 'module',
        label: module.name.split(' ')[0],
        risk: module.riskLevel,
      });
    });

    return positions;
  }, []);

  const positions = generatePositions();

  const getRiskColor = (risk: string, isHovered: boolean) => {
    const opacity = isHovered ? '1' : '0.8';
    if (risk === 'critical') return `hsl(var(--critical) / ${opacity})`;
    if (risk === 'warning') return `hsl(var(--warning) / ${opacity})`;
    return `hsl(var(--healthy) / ${opacity})`;
  };

  const getNodePosition = (id: string) => positions.find(p => p.id === id);

  const handleNodeClick = (node: NodePosition) => {
    if (node.type === 'person') {
      onSelectPerson(node.id);
    } else {
      onSelectModule(node.id);
    }
  };

  return (
    <div className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden">
      {/* Legend */}
      <div className="absolute top-4 left-4 flex gap-4 text-xs z-10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-critical/80" />
          <span className="text-muted-foreground">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-warning/80" />
          <span className="text-muted-foreground">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-healthy/80" />
          <span className="text-muted-foreground">Healthy</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex gap-4 text-xs z-10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
          <span className="text-muted-foreground">People</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm border-2 border-muted-foreground" />
          <span className="text-muted-foreground">Modules</span>
        </div>
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circles for visual structure */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="hsl(var(--border))" strokeWidth="0.2" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="18" fill="none" stroke="hsl(var(--border))" strokeWidth="0.2" strokeDasharray="2 2" />

        {/* Links */}
        {mockLinks.map((link, i) => {
          const source = getNodePosition(link.source);
          const target = getNodePosition(link.target);
          if (!source || !target) return null;

          const isHighlighted = hoveredNode === link.source || hoveredNode === link.target;
          const sourceNode = positions.find(p => p.id === link.source);
          const strokeColor = isHighlighted 
            ? getRiskColor(sourceNode?.risk || 'healthy', true)
            : 'hsl(var(--border))';

          return (
            <motion.line
              key={`${link.source}-${link.target}`}
              x1={`${source.x}%`}
              y1={`${source.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              stroke={strokeColor}
              strokeWidth={isHighlighted ? 0.5 : 0.2}
              strokeOpacity={isHighlighted ? 1 : 0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.05 }}
            />
          );
        })}

        {/* Nodes */}
        {positions.map((node, i) => {
          const isHovered = hoveredNode === node.id;
          const size = node.type === 'person' ? 4 : 3.5;
          const isCritical = node.risk === 'critical';

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
              className="cursor-pointer"
            >
              {/* Pulse ring for critical nodes */}
              {isCritical && (
                <motion.circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={size + 2}
                  fill="none"
                  stroke={getRiskColor(node.risk, true)}
                  strokeWidth={0.3}
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}

              {/* Node shape */}
              {node.type === 'person' ? (
                <motion.circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={isHovered ? size + 0.5 : size}
                  fill={getRiskColor(node.risk, isHovered)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, type: "spring" }}
                />
              ) : (
                <motion.rect
                  x={`${node.x - size/2}%`}
                  y={`${node.y - size/2}%`}
                  width={`${size}%`}
                  height={`${size}%`}
                  rx="0.5"
                  fill={getRiskColor(node.risk, isHovered)}
                  initial={{ scale: 0 }}
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ delay: 0.3 + i * 0.05, type: "spring" }}
                />
              )}

              {/* Label */}
              <motion.text
                x={`${node.x}%`}
                y={`${node.y + (node.type === 'person' ? size + 3 : size + 2.5)}%`}
                textAnchor="middle"
                className="fill-foreground text-[2.2px] font-medium pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered || isCritical ? 1 : 0.6 }}
                transition={{ delay: 0.5 + i * 0.03 }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card px-3 py-2 rounded-lg border border-border shadow-lg">
          <p className="text-sm font-medium">
            {positions.find(p => p.id === hoveredNode)?.label}
          </p>
          <p className="text-xs text-muted-foreground">Click to view details</p>
        </div>
      )}
    </div>
  );
}
