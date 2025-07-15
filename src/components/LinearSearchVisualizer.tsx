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

const LinearSearchVisualizer: React.FC<Props> = ({ algorithm, onBack }) => {
  const [evidence] = useState([
    'Fingerprint', 'Footprint', 'DNA Sample', 'Witness Statement', 
    'Security Footage', 'Phone Records', 'Bank Statement', 'Alibi Note',
    'Murder Weapon', 'Blood Sample'
  ]);
  const [target, setTarget] = useState('Murder Weapon');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [found, setFound] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [currentView, setCurrentView] = useState<'story' | 'visualizer' | 'code'>('story');
  const [comparisons, setComparisons] = useState(0);

  useEffect(() => {
    if (isPlaying && !searchComplete) {
      const timer = setTimeout(() => {
        setComparisons(prev => prev + 1);
        
        if (evidence[currentIndex] === target) {
          setFound(true);
          setSearchComplete(true);
          setIsPlaying(false);
        } else if (currentIndex >= evidence.length - 1) {
          setSearchComplete(true);
          setIsPlaying(false);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentIndex, evidence, target, searchComplete]);

  const handlePlay = () => {
    if (searchComplete) {
      handleReset();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setFound(false);
    setSearchComplete(false);
    setIsPlaying(false);
    setComparisons(0);
  };

  const getEvidenceStyle = (index: number) => {
    if (found && evidence[index] === target) {
      return 'bg-green-500 text-white scale-110 shadow-lg border-green-600';
    } else if (index === currentIndex && isPlaying) {
      return 'bg-blue-500 text-white scale-105 shadow-md border-blue-600';
    } else if (index < currentIndex) {
      return 'bg-gray-400 text-white border-gray-500';
    } else {
      return 'bg-yellow-200 text-gray-800 border-yellow-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Detective Holmes' Investigation</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  In the dimly lit evidence room of Scotland Yard, Detective Holmes faces a crucial 
                  moment in his investigation. The murder weapon must be found among the scattered 
                  pieces of evidence, and time is running out. With methodical precision, Holmes 
                  begins his systematic search.
                </p>
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">The Detective's Method</h3>
                  <p className="text-blue-800">
                    "Every piece of evidence must be examined," Holmes declares. "I shall start 
                    from the beginning and check each item one by one. Though it may take time, 
                    this thorough approach ensures that nothing is overlooked. Sometimes the 
                    simplest methods are the most reliable."
                  </p>
                </div>
                <p className="text-gray-600">
                  This is the essence of Linear Search - a straightforward, systematic approach 
                  that examines each element in sequence until the target is found. While not 
                  the fastest method for large datasets, its simplicity and reliability make 
                  it perfect for unsorted data and small collections.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Follow the Investigation</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualizer' && (
          <div className="space-y-8">
            {/* Evidence Room Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">The Evidence Room</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlay}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                  Looking for: <span className="font-semibold text-blue-600">{target}</span>
                </p>
                <p className="text-gray-600">
                  {found ? 'Evidence found! Case solved.' : 
                   searchComplete ? 'Search complete. Evidence not found in this collection.' :
                   `Examining evidence ${currentIndex + 1} of ${evidence.length}: "${evidence[currentIndex]}"`}
                </p>
              </div>

              {/* Evidence Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {evidence.map((item, index) => (
                  <div
                    key={index}
                    className={`h-24 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-500 cursor-pointer border-2 ${getEvidenceStyle(index)}`}
                    title={item}
                  >
                    <span className="text-center leading-tight px-2">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Search Progress */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Search Progress</span>
                  <span className="text-sm text-gray-500">
                    {currentIndex + 1} / {evidence.length} examined
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / evidence.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparisons Made</h3>
                <p className="text-3xl font-bold text-blue-600">{comparisons}</p>
                <p className="text-sm text-gray-500">Total evidence examined</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Position</h3>
                <p className="text-3xl font-bold text-purple-600">{currentIndex + 1}</p>
                <p className="text-sm text-gray-500">Out of {evidence.length} items</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
                <p className={`text-3xl font-bold ${found ? 'text-green-600' : searchComplete ? 'text-red-600' : 'text-yellow-600'}`}>
                  {found ? 'Found!' : searchComplete ? 'Not Found' : 'Searching...'}
                </p>
                <p className="text-sm text-gray-500">Investigation status</p>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Currently Examining</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded"></div>
                  <span className="text-sm text-gray-600">Already Examined</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Target Found</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-200 rounded"></div>
                  <span className="text-sm text-gray-600">Not Yet Examined</span>
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
                  <code>{`function linearSearch(arr, target) {
  // Start from the beginning and check each element
  for (let i = 0; i < arr.length; i++) {
    // Compare current element with target
    if (arr[i] === target) {
      return i; // Found! Return the index
    }
  }
  
  return -1; // Not found
}

// Alternative implementation with while loop
function linearSearchWhile(arr, target) {
  let index = 0;
  
  while (index < arr.length) {
    if (arr[index] === target) {
      return index;
    }
    index++;
  }
  
  return -1;
}

// Example usage:
const evidence = [
  'Fingerprint', 'Footprint', 'DNA Sample', 'Witness Statement',
  'Security Footage', 'Phone Records', 'Bank Statement', 'Alibi Note',
  'Murder Weapon', 'Blood Sample'
];

const result = linearSearch(evidence, 'Murder Weapon');
console.log(result); // Output: 8 (index of 'Murder Weapon')

// With error handling
function safeLinearSearch(arr, target) {
  if (!Array.isArray(arr)) {
    throw new Error('First argument must be an array');
  }
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return { found: true, index: i, value: arr[i] };
    }
  }
  
  return { found: false, index: -1, value: null };
}

// Time Complexity: O(n)
// Space Complexity: O(1)
// Best for: Small arrays, unsorted data, finding first occurrence`}</code>
                </pre>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Time Complexity</h3>
                  <p className="text-red-800 mb-2">O(n)</p>
                  <p className="text-red-700 text-sm">
                    Best case: O(1) - target is the first element<br/>
                    Worst case: O(n) - target is the last element or not found<br/>
                    Average case: O(n/2) ≈ O(n)
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">When to Use</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Small datasets (&lt; 100 elements)</li>
                    <li>• Unsorted arrays</li>
                    <li>• Finding first occurrence</li>
                    <li>• Simple implementation needed</li>
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

export default LinearSearchVisualizer;