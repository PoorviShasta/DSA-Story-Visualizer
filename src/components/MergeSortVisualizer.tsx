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
  left: number;
  right: number;
  mid?: number;
  action: 'divide' | 'merge' | 'complete';
  description: string;
}

const MergeSortVisualizer: React.FC<Props> = ({ algorithm, onBack }) => {
  const [originalArray] = useState([38, 27, 43, 3, 9, 82, 10]);
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
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length]);

  const generateSteps = () => {
    const steps: Step[] = [];
    const arr = [...originalArray];
    
    // Initial state
    steps.push({
      array: [...arr],
      left: 0,
      right: arr.length - 1,
      action: 'divide',
      description: 'Starting with the original scattered papers'
    });

    // Generate merge sort steps
    const mergeSort = (arr: number[], left: number, right: number, depth: number = 0) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Divide step
        steps.push({
          array: [...arr],
          left,
          right,
          mid,
          action: 'divide',
          description: `Dividing papers at position ${mid + 1} (depth ${depth + 1})`
        });

        // Recursively sort left and right
        mergeSort(arr, left, mid, depth + 1);
        mergeSort(arr, mid + 1, right, depth + 1);
        
        // Merge step
        merge(arr, left, mid, right);
        steps.push({
          array: [...arr],
          left,
          right,
          mid,
          action: 'merge',
          description: `Merging sorted sections from ${left + 1} to ${right + 1}`
        });
      }
    };

    const merge = (arr: number[], left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;
      
      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        k++;
      }
      
      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
      }
      
      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
      }
    };

    mergeSort(arr, 0, arr.length - 1);
    
    steps.push({
      array: [...arr],
      left: 0,
      right: arr.length - 1,
      action: 'complete',
      description: 'All papers are now perfectly organized!'
    });

    setSteps(steps);
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

    const isInCurrentSection = index >= step.left && index <= step.right;
    const isLeftSection = step.mid !== undefined && index >= step.left && index <= step.mid;
    const isRightSection = step.mid !== undefined && index > step.mid && index <= step.right;
    
    if (step.action === 'complete') {
      return 'bg-green-500 text-white';
    } else if (step.action === 'divide') {
      if (isLeftSection) return 'bg-blue-400 text-white';
      if (isRightSection) return 'bg-purple-400 text-white';
      if (isInCurrentSection) return 'bg-yellow-300';
    } else if (step.action === 'merge') {
      if (isInCurrentSection) return 'bg-green-400 text-white';
    }
    
    return 'bg-gray-200 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
                    currentView === 'story' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Story
                </button>
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'visualizer' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Visualizer
                </button>
                <button
                  onClick={() => setCurrentView('code')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'code' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Scholar's Method</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  In a cluttered study, a scholar faces a mountain of scattered research papers. 
                  Each paper contains valuable information, but finding anything in this chaos 
                  seems impossible. The scholar, wise in the ways of organization, employs an 
                  ancient technique: divide and conquer.
                </p>
                <div className="bg-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-purple-900 mb-3">The Great Division</h3>
                  <p className="text-purple-800">
                    "I cannot organize everything at once," the scholar realizes. "But I can 
                    divide these papers into smaller groups, organize each group perfectly, 
                    and then combine them back together in perfect order." This wisdom forms 
                    the heart of merge sort.
                  </p>
                </div>
                <p className="text-gray-600">
                  The scholar divides the papers again and again until each pile contains 
                  just one paper. Then, with careful precision, they merge these tiny 
                  organized piles back together, always maintaining perfect order. The 
                  result is a beautifully organized collection, achieved through the 
                  power of systematic division and reunion.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch the Organization Process</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualizer' && (
          <div className="space-y-8">
            {/* Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">The Scholar's Desk</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlay}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
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

              {/* Paper Visualization */}
              <div className="bg-gray-50 rounded-lg p-8 min-h-[200px]">
                <div className="flex items-center justify-center space-x-3">
                  {steps[currentStep]?.array.map((value, index) => (
                    <div
                      key={index}
                      className={`w-16 h-20 rounded-lg flex items-center justify-center text-lg font-semibold transition-all duration-500 ${getElementStyle(index)}`}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Current Action</h3>
                  <p className="text-blue-800 capitalize">{steps[currentStep]?.action}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Working Range</h3>
                  <p className="text-purple-800">
                    {steps[currentStep] ? 
                      `Position ${steps[currentStep].left + 1} to ${steps[currentStep].right + 1}` : 
                      'N/A'
                    }
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-green-800 text-sm">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
                  </p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-400 rounded"></div>
                  <span className="text-sm text-gray-600">Left Section</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-400 rounded"></div>
                  <span className="text-sm text-gray-600">Right Section</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-400 rounded"></div>
                  <span className="text-sm text-gray-600">Being Merged</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Fully Sorted</span>
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
                  <code>{`function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  // Divide the array into two halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);
  
  // Merge the sorted halves
  return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and merge in order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }
  
  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }
  
  return result;
}

// Example usage:
const papers = [38, 27, 43, 3, 9, 82, 10];
console.log("Original:", papers);

const sorted = mergeSort(papers);
console.log("Sorted:", sorted);
// Output: [3, 9, 10, 27, 38, 43, 82]

// Time Complexity: O(n log n) - always!
// Space Complexity: O(n)
// Stable: Yes`}</code>
                </pre>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Time Complexity</h3>
                  <p className="text-green-800 mb-2">O(n log n)</p>
                  <p className="text-green-700 text-sm">
                    Consistently O(n log n) for all cases - best, worst, and average. 
                    The divide step is O(log n) and merging is O(n).
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Advantages</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Predictable O(n log n) performance</li>
                    <li>• Stable sorting algorithm</li>
                    <li>• Excellent for large datasets</li>
                    <li>• Parallelizable (divide and conquer)</li>
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

export default MergeSortVisualizer;