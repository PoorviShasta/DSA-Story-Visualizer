import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, BookOpen, Code, ChevronRight } from 'lucide-react';

interface Props {
  algorithm: {
    id: string;
    title: string;
    description: string;
    story: string;
    difficulty: string;
    color: string;
  };
  onBack: () => void;
}

interface Node {
  id: string;
  x: number;
  y: number;
  distance: number;
  visited: boolean;
  previous: string | null;
  name: string;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

const DijkstraVisualizer: React.FC<Props> = ({ algorithm, onBack }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [currentNode, setCurrentNode] = useState<string>('A');
  const [targetNode, setTargetNode] = useState<string>('F');
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'story' | 'visualizer' | 'code'>('story');
  const [pathFound, setPathFound] = useState(false);
  const [finalPath, setFinalPath] = useState<string[]>([]);

  useEffect(() => {
    initializeGraph();
  }, []);

  const initializeGraph = () => {
    const initialNodes: Node[] = [
      { id: 'A', x: 100, y: 200, distance: 0, visited: false, previous: null, name: 'Market Square' },
      { id: 'B', x: 300, y: 100, distance: Infinity, visited: false, previous: null, name: 'Blacksmith' },
      { id: 'C', x: 300, y: 300, distance: Infinity, visited: false, previous: null, name: 'Bakery' },
      { id: 'D', x: 500, y: 100, distance: Infinity, visited: false, previous: null, name: 'Cathedral' },
      { id: 'E', x: 500, y: 300, distance: Infinity, visited: false, previous: null, name: 'Tavern' },
      { id: 'F', x: 700, y: 200, distance: Infinity, visited: false, previous: null, name: 'Castle' }
    ];

    const initialEdges: Edge[] = [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'E', weight: 10 },
      { from: 'D', to: 'E', weight: 3 },
      { from: 'D', to: 'F', weight: 2 },
      { from: 'E', to: 'F', weight: 4 }
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
    setStepIndex(0);
    setPathFound(false);
    setFinalPath([]);
  };

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        performDijkstraStep();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, stepIndex]);

  const performDijkstraStep = () => {
    const unvisitedNodes = nodes.filter(node => !node.visited);
    
    if (unvisitedNodes.length === 0 || currentNode === targetNode) {
      setIsPlaying(false);
      buildFinalPath();
      return;
    }

    // Find unvisited node with minimum distance
    const nextNode = unvisitedNodes.reduce((min, node) => 
      node.distance < min.distance ? node : min
    );

    // Update current node
    setCurrentNode(nextNode.id);

    // Mark as visited
    const updatedNodes = nodes.map(node => 
      node.id === nextNode.id ? { ...node, visited: true } : node
    );

    // Update distances to neighbors
    const neighbors = edges.filter(edge => edge.from === nextNode.id || edge.to === nextNode.id);
    
    neighbors.forEach(edge => {
      const neighborId = edge.from === nextNode.id ? edge.to : edge.from;
      const neighbor = updatedNodes.find(n => n.id === neighborId);
      
      if (neighbor && !neighbor.visited) {
        const newDistance = nextNode.distance + edge.weight;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previous = nextNode.id;
        }
      }
    });

    setNodes(updatedNodes);
    setStepIndex(prev => prev + 1);

    if (nextNode.id === targetNode) {
      setPathFound(true);
      setIsPlaying(false);
      buildFinalPath();
    }
  };

  const buildFinalPath = () => {
    const path: string[] = [];
    let current = targetNode;
    
    while (current !== null) {
      path.unshift(current);
      const node = nodes.find(n => n.id === current);
      current = node?.previous || null;
    }
    
    setFinalPath(path);
  };

  const handlePlay = () => {
    if (pathFound) {
      handleReset();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    initializeGraph();
    setCurrentNode('A');
    setIsPlaying(false);
    setStepIndex(0);
    setPathFound(false);
    setFinalPath([]);
  };

  const getNodeStyle = (node: Node) => {
    const isCurrentNode = node.id === currentNode;
    const isTargetNode = node.id === targetNode;
    const isInFinalPath = finalPath.includes(node.id);
    const isStartNode = node.id === 'A';
    
    if (isInFinalPath && pathFound) {
      return 'bg-green-500 text-white border-green-600';
    } else if (isCurrentNode) {
      return 'bg-blue-500 text-white border-blue-600';
    } else if (isTargetNode) {
      return 'bg-red-500 text-white border-red-600';
    } else if (isStartNode) {
      return 'bg-purple-500 text-white border-purple-600';
    } else if (node.visited) {
      return 'bg-gray-400 text-white border-gray-500';
    } else {
      return 'bg-yellow-200 text-gray-800 border-yellow-400';
    }
  };

  const getEdgeStyle = (edge: Edge) => {
    const isInFinalPath = finalPath.includes(edge.from) && finalPath.includes(edge.to);
    return isInFinalPath && pathFound ? 'stroke-green-500 stroke-4' : 'stroke-gray-400 stroke-2';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Algorithms</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">{algorithm.title}</h1>
              <span className="text-sm text-gray-500">{algorithm.difficulty}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => setCurrentView('story')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'story' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Story
                </button>
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'visualizer' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Visualizer
                </button>
                <button
                  onClick={() => setCurrentView('code')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'code' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Code className="w-4 h-4 inline mr-2" />
                  Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'story' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Merchant's Journey</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  In a medieval city filled with winding cobblestone streets, a wise merchant 
                  needs to find the shortest path from the bustling Market Square to the 
                  grand Castle. The city is a maze of interconnected locations, each path 
                  having a different travel time based on distance and traffic.
                </p>
                <div className="bg-orange-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-orange-900 mb-3">The Merchant's Strategy</h3>
                  <p className="text-orange-800">
                    The merchant, experienced in the art of efficient travel, employs a 
                    systematic approach. Starting from the Market Square, they consider 
                    all possible destinations and always choose the closest unvisited 
                    location. At each stop, they update their knowledge of the shortest 
                    paths to all other locations.
                  </p>
                </div>
                <p className="text-gray-600">
                  This methodical approach ensures that the merchant discovers the truly 
                  shortest path to every location in the city. By the time they reach 
                  the Castle, they have not only found the optimal route but also mapped 
                  the most efficient paths to everywhere else in the city.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Follow the Merchant's Path</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualizer' && (
          <div className="space-y-8">
            {/* Graph Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Medieval City Map</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlay}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-600">
                  {pathFound ? 
                    `Shortest path found! Distance: ${nodes.find(n => n.id === targetNode)?.distance}` :
                    `Currently exploring: ${nodes.find(n => n.id === currentNode)?.name}`
                  }
                </p>
              </div>

              {/* SVG Graph */}
              <div className="bg-amber-50 rounded-lg p-4">
                <svg width="800" height="400" viewBox="0 0 800 400" className="w-full h-auto">
                  {/* Edges */}
                  {edges.map((edge, index) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    
                    const midX = (fromNode.x + toNode.x) / 2;
                    const midY = (fromNode.y + toNode.y) / 2;
                    
                    return (
                      <g key={index}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          className={getEdgeStyle(edge)}
                        />
                        <circle
                          cx={midX}
                          cy={midY}
                          r="15"
                          fill="white"
                          stroke="gray"
                          strokeWidth="1"
                        />
                        <text
                          x={midX}
                          y={midY + 4}
                          textAnchor="middle"
                          className="text-sm font-semibold"
                        >
                          {edge.weight}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Nodes */}
                  {nodes.map((node) => (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="30"
                        className={`${getNodeStyle(node)} border-4 transition-all duration-300`}
                      />
                      <text
                        x={node.x}
                        y={node.y - 5}
                        textAnchor="middle"
                        className="text-sm font-bold"
                      >
                        {node.id}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 8}
                        textAnchor="middle"
                        className="text-xs"
                      >
                        {node.distance === Infinity ? '∞' : node.distance}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 50}
                        textAnchor="middle"
                        className="text-xs text-gray-600"
                      >
                        {node.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Node Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nodes.map((node) => (
                <div key={node.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{node.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getNodeStyle(node)}`}>
                      {node.id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Distance: {node.distance === Infinity ? '∞' : node.distance}</div>
                    <div>Previous: {node.previous || 'None'}</div>
                    <div>Status: {node.visited ? 'Visited' : 'Unvisited'}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Start (Market Square)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Target (Castle)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Current Node</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Shortest Path</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Visited</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'code' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation</h2>
              <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <code>{`function dijkstra(graph, start, target) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const unvisited = new Set();
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
    unvisited.add(node);
  }
  
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        current = node;
        minDistance = distances[node];
      }
    }
    
    if (current === null || current === target) {
      break;
    }
    
    // Mark as visited
    visited.add(current);
    unvisited.delete(current);
    
    // Update distances to neighbors
    for (const neighbor in graph[current]) {
      const weight = graph[current][neighbor];
      const newDistance = distances[current] + weight;
      
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
      }
    }
  }
  
  // Build path
  const path = [];
  let current = target;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  return {
    distance: distances[target],
    path: path,
    distances: distances
  };
}

// Example usage:
const cityGraph = {
  'A': { 'B': 4, 'C': 2 },
  'B': { 'A': 4, 'C': 1, 'D': 5 },
  'C': { 'A': 2, 'B': 1, 'E': 10 },
  'D': { 'B': 5, 'E': 3, 'F': 2 },
  'E': { 'C': 10, 'D': 3, 'F': 4 },
  'F': { 'D': 2, 'E': 4 }
};

const result = dijkstra(cityGraph, 'A', 'F');
console.log(\`Shortest distance: \${result.distance}\`);
console.log(\`Path: \${result.path.join(' -> ')}\`);

// Time Complexity: O(V² + E) with simple implementation
// Space Complexity: O(V)
// Can be optimized to O(E + V log V) with priority queue`}</code>
                </pre>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Time Complexity</h3>
                  <p className="text-orange-800 mb-2">O(V² + E)</p>
                  <p className="text-orange-700 text-sm">
                    V = number of vertices, E = number of edges. Can be optimized to 
                    O(E + V log V) using a priority queue (min-heap).
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Applications</h3>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• GPS navigation systems</li>
                    <li>• Network routing protocols</li>
                    <li>• Social network analysis</li>
                    <li>• Game AI pathfinding</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DijkstraVisualizer;