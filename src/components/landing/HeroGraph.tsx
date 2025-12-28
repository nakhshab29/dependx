import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const nodes = [
  { id: 1, x: 50, y: 30, type: 'person', label: 'Dev A', risk: 'critical' },
  { id: 2, x: 80, y: 50, type: 'module', label: 'Payments', risk: 'critical' },
  { id: 3, x: 20, y: 55, type: 'person', label: 'Dev B', risk: 'warning' },
  { id: 4, x: 50, y: 70, type: 'module', label: 'Auth', risk: 'warning' },
  { id: 5, x: 75, y: 85, type: 'person', label: 'Dev C', risk: 'healthy' },
  { id: 6, x: 25, y: 85, type: 'module', label: 'UI', risk: 'healthy' },
];

const links = [
  { from: 1, to: 2, strength: 95 },
  { from: 1, to: 4, strength: 60 },
  { from: 3, to: 4, strength: 70 },
  { from: 3, to: 6, strength: 50 },
  { from: 5, to: 6, strength: 80 },
  { from: 5, to: 4, strength: 40 },
];

export function HeroGraph() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cycle through highlighting different critical nodes
    const criticalNodes = [1, 2];
    if (animationStep < 2) {
      setActiveNode(criticalNodes[animationStep]);
    } else {
      setActiveNode(null);
    }
  }, [animationStep]);

  const getRiskColor = (risk: string, isActive: boolean) => {
    if (isActive) {
      if (risk === 'critical') return 'hsl(var(--critical))';
      if (risk === 'warning') return 'hsl(var(--warning))';
      return 'hsl(var(--healthy))';
    }
    if (risk === 'critical') return 'hsl(var(--critical) / 0.7)';
    if (risk === 'warning') return 'hsl(var(--warning) / 0.7)';
    return 'hsl(var(--healthy) / 0.7)';
  };

  const getLinkColor = (fromNode: typeof nodes[0], toNode: typeof nodes[0]) => {
    const fromRisk = fromNode?.risk;
    const toRisk = toNode?.risk;
    if (fromRisk === 'critical' || toRisk === 'critical') return 'hsl(var(--critical) / 0.4)';
    if (fromRisk === 'warning' || toRisk === 'warning') return 'hsl(var(--warning) / 0.3)';
    return 'hsl(var(--healthy) / 0.3)';
  };

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full" />
      
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Links */}
        {links.map((link, i) => {
          const fromNode = nodes.find(n => n.id === link.from);
          const toNode = nodes.find(n => n.id === link.to);
          if (!fromNode || !toNode) return null;

          const isHighlighted = activeNode === link.from || activeNode === link.to;

          return (
            <motion.line
              key={i}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke={getLinkColor(fromNode, toNode)}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeDasharray={isHighlighted ? "0" : "4 2"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: isHighlighted ? 1 : 0.5,
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isActive = activeNode === node.id;
          const size = node.type === 'person' ? 6 : 5;

          return (
            <g key={node.id}>
              {/* Pulse ring for active/critical nodes */}
              {(isActive || (node.risk === 'critical' && !activeNode)) && (
                <motion.circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={size + 4}
                  fill="none"
                  stroke={getRiskColor(node.risk, true)}
                  strokeWidth={1}
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
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
                  r={size}
                  fill={getRiskColor(node.risk, isActive)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isActive ? 1.2 : 1, 
                    opacity: 1 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + i * 0.1,
                    type: "spring"
                  }}
                />
              ) : (
                <motion.rect
                  x={`${node.x - size/2}%`}
                  y={`${node.y - size/2}%`}
                  width={`${size}%`}
                  height={`${size}%`}
                  rx="1"
                  fill={getRiskColor(node.risk, isActive)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isActive ? 1.2 : 1, 
                    opacity: 1 
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.5 + i * 0.1,
                    type: "spring"
                  }}
                />
              )}

              {/* Label */}
              <motion.text
                x={`${node.x}%`}
                y={`${node.y + size + 4}%`}
                textAnchor="middle"
                className="fill-muted-foreground text-[3px] font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0.7 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-critical" />
          <span>Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span>Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-healthy" />
          <span>Healthy</span>
        </div>
      </div>
    </div>
  );
}
