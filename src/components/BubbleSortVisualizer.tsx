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

const BubbleSortVisualizer: React.FC<Props> = ({ algorithm, onBack }) => {
  const [bubbles, setBubbles] = useState([8, 3, 5, 4, 7, 6, 1, 2]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentI, setCurrentI] = useState(0);
  const [currentJ, setCurrentJ] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentView, setCurrentView] = useState<'story' | 'visualizer' | 'code'>('story');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      const timer = setTimeout(() => {
        performStep();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentI, currentJ, bubbles, isComplete]);

  const performStep = () => {
    if (currentI >= bubbles.length - 1) {
      setIsComplete(true);
      setIsPlaying(false);
      return;
    }

    const newBubbles = [...bubbles];
    setComparisons(prev => prev + 1);

    if (newBubbles[currentJ] > newBubbles[currentJ + 1]) {
      // Swap
      [newBubbles[currentJ], newBubbles[currentJ + 1]] = [newBubbles[currentJ + 1], newBubbles[currentJ]];
      setBubbles(newBubbles);
      setSwaps(prev => prev + 1);
    }

    if (currentJ >= bubbles.length - 2 - currentI) {
      setCurrentI(prev => prev + 1);
      setCurrentJ(0);
    } else {
      setCurrentJ(prev => prev + 1);
    }
  };

  const handlePlay = () => {
    if (isComplete) {
      handleReset();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setBubbles([8, 3, 5, 4, 7, 6, 1, 2]);
    setCurrentI(0);
    setCurrentJ(0);
    setComparisons(0);
    setSwaps(0);
    setIsPlaying(false);
    setIsComplete(false);
  };

  const getBubbleStyle = (value: number, index: number) => {
    const isComparing = index === currentJ || index === currentJ + 1;
    const isSorted = index >= bubbles.length - currentI;
    const baseSize = 40;
    const size = baseSize + (value * 8);
    
    return {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: isComplete || isSorted ? '#10b981' : isComparing ? '#3b82f6' : '#60a5fa',
      transform: isComparing ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 0.5s ease',
      opacity: isComparing ? 1 : 0.8
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
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
                    currentView === 'story' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Story
                </button>
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'visualizer' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Visualizer
                </button>
                <button
                  onClick={() => setCurrentView('code')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'code' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Ocean's Sorting Symphony</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  Deep beneath the ocean's surface, where sunlight barely penetrates, a fascinating 
                  phenomenon occurs. Air bubbles of different sizes, trapped in the depths, begin 
                  their journey to the surface. Nature has its own sorting algorithm - the largest 
                  bubbles rise fastest, while smaller ones follow behind.
                </p>
                <div className="bg-cyan-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-cyan-900 mb-3">The Natural Order</h3>
                  <p className="text-cyan-800">
                    Our bubbles don't rise randomly. They compare themselves with their neighbors, 
                    and the larger ones push upward past the smaller ones. With each comparison, 
                    the natural order asserts itself - big bubbles rise, small bubbles settle, 
                    until perfect harmony is achieved.
                  </p>
                </div>
                <p className="text-gray-600">
                  This is the essence of Bubble Sort - a simple yet elegant algorithm that mimics 
                  nature's own sorting process. Though not the fastest, it's beautiful in its 
                  simplicity and helps us understand the fundamental concept of comparison-based 
                  sorting.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch the Bubbles Rise</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualizer' && (
          <div className="space-y-8">
            {/* Ocean Visualization */}
            <div className="bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">The Ocean Floor</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlay}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-blue-100 mb-2">
                  Current Pass: {currentI + 1} / {bubbles.length}
                </p>
                <p className="text-blue-100">
                  {isComplete ? 'All bubbles have reached their perfect position!' : 
                   `Comparing bubble ${currentJ + 1} with bubble ${currentJ + 2}`}
                </p>
              </div>

              {/* Bubble Animation */}
              <div className="bg-blue-500/30 rounded-lg p-8 min-h-[300px] flex items-end justify-center space-x-4">
                {bubbles.map((value, index) => (
                  <div
                    key={index}
                    className="rounded-full bg-blue-400 border-4 border-blue-200 flex items-center justify-center text-white font-bold shadow-lg"
                    style={getBubbleStyle(value, index)}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparisons</h3>
                <p className="text-3xl font-bold text-blue-600">{comparisons}</p>
                <p className="text-sm text-gray-500">Total comparisons made</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Swaps</h3>
                <p className="text-3xl font-bold text-green-600">{swaps}</p>
                <p className="text-sm text-gray-500">Elements swapped</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentI + 1) / bubbles.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {Math.round(((currentI + 1) / bubbles.length) * 100)}% complete
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Currently Comparing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Sorted Position</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-400 rounded-full opacity-80"></div>
                  <span className="text-sm text-gray-600">Unsorted</span>
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
                  <code>{`function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    
    // Last i elements are already in place
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap if they are in wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swapping happened, array is sorted
    if (!swapped) {
      break;
    }
  }
  
  return arr;
}

// Example usage:
const bubbles = [8, 3, 5, 4, 7, 6, 1, 2];
console.log("Original:", bubbles);

const sorted = bubbleSort([...bubbles]);
console.log("Sorted:", sorted);
// Output: [1, 2, 3, 4, 5, 6, 7, 8]

// Time Complexity: O(n²)
// Space Complexity: O(1)
// Stable: Yes (maintains relative order of equal elements)`}</code>
                </pre>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Time Complexity</h3>
                  <p className="text-red-800 mb-2">O(n²)</p>
                  <p className="text-red-700 text-sm">
                    Worst case: O(n²) when array is reverse sorted<br/>
                    Best case: O(n) when array is already sorted<br/>
                    Average case: O(n²)
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Key Properties</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Stable sorting algorithm</li>
                    <li>• In-place sorting (O(1) space)</li>
                    <li>• Simple to understand and implement</li>
                    <li>• Adaptive (performs better on nearly sorted data)</li>
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

export default BubbleSortVisualizer;