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

interface Step {
  array: number[];
  heapSize: number;
  action: 'heapify' | 'extract' | 'complete';
  description: string;
  highlightIndices: number[];
}

const HeapSortVisualizer: React.FC<Props> = ({ algorithm, onBack }) => {
  const [originalArray] = useState([4, 10, 3, 5, 1, 8, 7, 6, 9, 2]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState<'story' | 'visualizer' | 'code'>('story');

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length]);

  const generateSteps = () => {
    const steps: Step[] = [];
    const arr = [...originalArray];
    const n = arr.length;
    
    steps.push({
      array: [...arr],
      heapSize: n,
      action: 'heapify',
      description: 'The mountain climber begins organizing the peak - building the initial heap',
      highlightIndices: []
    });

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, steps);
    }

    steps.push({
      array: [...arr],
      heapSize: n,
      action: 'heapify',
      description: 'The mountain is now properly formed - largest elements rise to the top!',
      highlightIndices: [0]
    });

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      [arr[0], arr[i]] = [arr[i], arr[0]];
      
      steps.push({
        array: [...arr],
        heapSize: i,
        action: 'extract',
        description: `Peak conquered! Moving the largest element (${arr[i]}) to its final position`,
        highlightIndices: [0, i]
      });

      // Call heapify on the reduced heap
      heapify(arr, i, 0, steps);
    }

    steps.push({
      array: [...arr],
      heapSize: 0,
      action: 'complete',
      description: 'Victory! The mountain has been completely conquered and organized!',
      highlightIndices: []
    });

    setSteps(steps);
  };

  const heapify = (arr: number[], n: number, i: number, steps: Step[]) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      
      steps.push({
        array: [...arr],
        heapSize: n,
        action: 'heapify',
        description: `Adjusting the mountain structure - swapping positions ${i + 1} and ${largest + 1}`,
        highlightIndices: [i, largest]
      });

      heapify(arr, n, largest, steps);
    }
  };

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      handleReset();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const getElementStyle = (index: number) => {
    const step = steps[currentStep];
    if (!step) return 'bg-gray-200';

    if (step.action === 'complete') {
      return 'bg-green-500 text-white';
    } else if (step.highlightIndices.includes(index)) {
      return 'bg-red-500 text-white scale-110';
    } else if (index >= step.heapSize) {
      return 'bg-green-400 text-white';
    } else if (index === 0) {
      return 'bg-yellow-500 text-white';
    }
    
    return 'bg-blue-300 text-gray-800';
  };

  const getTreePosition = (index: number) => {
    const level = Math.floor(Math.log2(index + 1));
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);
    
    const x = (positionInLevel + 0.5) / totalInLevel;
    const y = level * 80 + 50;
    
    return { x: x * 600 + 100, y };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
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
                    currentView === 'story' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Story
                </button>
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'visualizer' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Visualizer
                </button>
                <button
                  onClick={() => setCurrentView('code')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'code' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-gray-900'
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Mountain Climber's Conquest</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  High in the Himalayas, a skilled mountain climber faces the ultimate challenge: 
                  organizing a treacherous mountain peak where the largest rocks naturally rise 
                  to the summit. The climber understands that by working with nature's tendency 
                  to elevate the heaviest elements, perfect order can be achieved.
                </p>
                <div className="bg-red-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-red-900 mb-3">The Peak Strategy</h3>
                  <p className="text-red-800">
                    "First, I'll build the mountain properly," the climber declares, "ensuring 
                    the largest rocks rise to the top. Then, I'll repeatedly take the peak 
                    element and place it in its final position, rebuilding the mountain each 
                    time until perfect order emerges."
                  </p>
                </div>
                <p className="text-gray-600">
                  This is the essence of Heap Sort - a sorting algorithm that leverages the 
                  heap data structure's natural property where the largest element always 
                  rises to the top. Through systematic extraction and reorganization, it 
                  achieves guaranteed O(n log n) performance.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Climb the Data Mountain</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualizer' && (
          <div className="space-y-8">
            {/* Mountain Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">The Data Mountain</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlay}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
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
                <p className="text-gray-600 mb-2">
                  Step {currentStep + 1} of {steps.length}
                </p>
                <p className="text-gray-600">
                  {steps[currentStep]?.description}
                </p>
              </div>

              {/* Tree Visualization */}
              <div className="bg-gradient-to-b from-red-100 to-pink-100 rounded-lg p-4 mb-6" style={{ height: '400px' }}>
                <svg width="800" height="380" viewBox="0 0 800 380" className="w-full h-full">
                  {/* Draw connections */}
                  {steps[currentStep]?.array.map((_, index) => {
                    if (index === 0) return null;
                    const parentIndex = Math.floor((index - 1) / 2);
                    const childPos = getTreePosition(index);
                    const parentPos = getTreePosition(parentIndex);
                    
                    return (
                      <line
                        key={`line-${index}`}
                        x1={parentPos.x}
                        y1={parentPos.y}
                        x2={childPos.x}
                        y2={childPos.y}
                        stroke="#94a3b8"
                        strokeWidth="2"
                      />
                    );
                  })}
                  
                  {/* Draw nodes */}
                  {steps[currentStep]?.array.map((value, index) => {
                    const pos = getTreePosition(index);
                    const style = getElementStyle(index);
                    
                    return (
                      <g key={index}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="25"
                          className={`${style} border-2 transition-all duration-500`}
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 5}
                          textAnchor="middle"
                          className="text-sm font-bold"
                        >
                          {value}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Array Representation */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Array Representation</h3>
                <div className="flex items-center justify-center space-x-2">
                  {steps[currentStep]?.array.map((value, index) => (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-500 ${getElementStyle(index)}`}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Heap Size</h3>
                <p className="text-3xl font-bold text-red-600">{steps[currentStep]?.heapSize || 0}</p>
                <p className="text-sm text-gray-500">Elements in active heap</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sorted Elements</h3>
                <p className="text-3xl font-bold text-green-600">
                  {originalArray.length - (steps[currentStep]?.heapSize || originalArray.length)}
                </p>
                <p className="text-sm text-gray-500">Elements in final position</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Root (Peak)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Being Processed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">In Heap</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Sorted</span>
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
                  <code>{`function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call heapify on the reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i; // Initialize largest as root
  const left = 2 * i + 1; // Left child
  const right = 2 * i + 2; // Right child
  
  // If left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If largest is not root
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}

// Helper functions for heap operations
function getParent(i) {
  return Math.floor((i - 1) / 2);
}

function getLeftChild(i) {
  return 2 * i + 1;
}

function getRightChild(i) {
  return 2 * i + 2;
}

// Example usage:
const mountain = [4, 10, 3, 5, 1, 8, 7, 6, 9, 2];
console.log("Original mountain:", mountain);

const sorted = heapSort([...mountain]);
console.log("Conquered mountain:", sorted);
// Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Time Complexity: O(n log n) - always!
// Space Complexity: O(1) - in-place sorting
// Stable: No (relative order not preserved)`}</code>
                </pre>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Time Complexity</h3>
                  <p className="text-green-800 mb-2">O(n log n)</p>
                  <p className="text-green-700 text-sm">
                    Consistent O(n log n) performance for all cases - best, worst, and average. 
                    Building the heap takes O(n) time, and extracting n elements takes O(n log n).
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Key Properties</h3>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Guaranteed O(n log n) performance</li>
                    <li>• In-place sorting (O(1) space)</li>
                    <li>• Not stable (doesn't preserve relative order)</li>
                    <li>• Good for systems with memory constraints</li>
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

export default HeapSortVisualizer;