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
  pivotIndex: number;
  left: number;
  right: number;
  action: 'partition' | 'swap' | 'complete';
  description: string;
}

const QuickSortVisualizer: React.FC<Props> = ({ algorithm, onBack }) => {
  const [originalArray] = useState([64, 34, 25, 12, 22, 11, 90]);
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
    
    steps.push({
      array: [...arr],
      pivotIndex: -1,
      left: 0,
      right: arr.length - 1,
      action: 'partition',
      description: 'The commander surveys the battlefield, ready to organize the troops'
    });

    const quickSort = (arr: number[], low: number, high: number) => {
      if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
      }
    };

    const partition = (arr: number[], low: number, high: number): number => {
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        array: [...arr],
        pivotIndex: high,
        left: low,
        right: high,
        action: 'partition',
        description: `Commander chooses position ${high + 1} (value ${pivot}) as the strategic pivot point`
      });

      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          
          steps.push({
            array: [...arr],
            pivotIndex: high,
            left: i,
            right: j,
            action: 'swap',
            description: `Swapping troops at positions ${i + 1} and ${j + 1} - smaller values move left`
          });
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      
      steps.push({
        array: [...arr],
        pivotIndex: i + 1,
        left: low,
        right: high,
        action: 'partition',
        description: `Pivot ${pivot} finds its final position at ${i + 2}`
      });

      return i + 1;
    };

    quickSort(arr, 0, arr.length - 1);
    
    steps.push({
      array: [...arr],
      pivotIndex: -1,
      left: 0,
      right: arr.length - 1,
      action: 'complete',
      description: 'Victory! All troops are perfectly organized in battle formation'
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

    if (step.action === 'complete') {
      return 'bg-green-500 text-white';
    } else if (index === step.pivotIndex) {
      return 'bg-yellow-500 text-white';
    } else if (step.action === 'swap' && (index === step.left || index === step.right)) {
      return 'bg-red-500 text-white';
    } else if (index >= step.left && index <= step.right) {
      return 'bg-blue-300 text-gray-800';
    }
    
    return 'bg-gray-200 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
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
                    currentView === 'story' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Story
                </button>
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'visualizer' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Visualizer
                </button>
                <button
                  onClick={() => setCurrentView('code')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'code' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600 hover:text-gray-900'
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Swift Commander's Strategy</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  On the ancient battlefield, a brilliant commander faces the challenge of 
                  organizing scattered troops into perfect formation. Unlike other generals 
                  who might organize troops one by one, this commander employs a revolutionary 
                  strategy: divide and conquer with strategic pivot points.
                </p>
                <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-yellow-900 mb-3">The Pivot Strategy</h3>
                  <p className="text-yellow-800">
                    "Choose a strategic position," the commander declares, "and organize all 
                    troops around it. Those smaller in rank go to the left, those greater 
                    to the right. Then repeat this strategy for each group until perfect 
                    order emerges from chaos."
                  </p>
                </div>
                <p className="text-gray-600">
                  This is the essence of Quick Sort - an elegant divide-and-conquer algorithm 
                  that achieves remarkable efficiency through strategic partitioning. By 
                  choosing pivot points and organizing elements around them, it transforms 
                  disorder into perfect order with surprising speed.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch the Battle Formation</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualizer' && (
          <div className="space-y-8">
            {/* Battlefield Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">The Battlefield</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlay}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
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

              {/* Troop Formation */}
              <div className="bg-amber-50 rounded-lg p-8 min-h-[200px]">
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

              {/* Battle Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Current Action</h3>
                  <p className="text-yellow-800 capitalize">{steps[currentStep]?.action}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Pivot Position</h3>
                  <p className="text-orange-800">
                    {steps[currentStep]?.pivotIndex >= 0 ? 
                      `Position ${steps[currentStep].pivotIndex + 1}` : 
                      'None selected'
                    }
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">Working Range</h3>
                  <p className="text-red-800">
                    {steps[currentStep] ? 
                      `${steps[currentStep].left + 1} to ${steps[currentStep].right + 1}` : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Battle Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
              </p>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-600">Pivot Element</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Being Swapped</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-300 rounded"></div>
                  <span className="text-sm text-gray-600">Active Range</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
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
                  <code>{`function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get pivot index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];
  
  // Index of smaller element (indicates right position of pivot)
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    // If current element is smaller than or equal to pivot
    if (arr[j] <= pivot) {
      i++; // Increment index of smaller element
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
  }
  
  // Place pivot in correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  return i + 1; // Return position of pivot
}

// Alternative: Random pivot selection for better average performance
function randomizedQuickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Randomly select pivot and swap with last element
    const randomIndex = Math.floor(Math.random() * (high - low + 1)) + low;
    [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];
    
    const pivotIndex = partition(arr, low, high);
    randomizedQuickSort(arr, low, pivotIndex - 1);
    randomizedQuickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

// Example usage:
const troops = [64, 34, 25, 12, 22, 11, 90];
console.log("Original formation:", troops);

const sorted = quickSort([...troops]);
console.log("Battle formation:", sorted);
// Output: [11, 12, 22, 25, 34, 64, 90]

// Time Complexity: O(n log n) average, O(n²) worst case
// Space Complexity: O(log n) average (recursion stack)
// In-place: Yes (with O(log n) extra space for recursion)`}</code>
                </pre>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Time Complexity</h3>
                  <p className="text-green-800 mb-2">Average: O(n log n)</p>
                  <p className="text-green-700 text-sm">
                    Best case: O(n log n) - balanced partitions<br/>
                    Average case: O(n log n) - random pivots<br/>
                    Worst case: O(n²) - already sorted with poor pivot choice
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Key Advantages</h3>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Very fast average performance</li>
                    <li>• In-place sorting (low memory usage)</li>
                    <li>• Cache-efficient</li>
                    <li>• Widely used in practice</li>
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

export default QuickSortVisualizer;