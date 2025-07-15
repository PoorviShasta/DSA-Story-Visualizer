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

interface StoryStep {
  title: string;
  description: string;
  code: string;
  highlight: number[];
}

const BinarySearchVisualizer: React.FC<Props> = ({ algorithm, onBack }) => {
  const [books] = useState([
    'Alice in Wonderland', 'Brave New World', 'Catch-22', 'Don Quixote', 
    'Emma', 'Fahrenheit 451', 'Great Expectations', 'Heart of Darkness',
    'Jane Eyre', 'King Lear', 'Lord of the Flies', 'Moby Dick'
  ]);
  const [target, setTarget] = useState('Jane Eyre');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(11);
  const [mid, setMid] = useState(5);
  const [found, setFound] = useState(false);
  const [currentView, setCurrentView] = useState<'story' | 'visualizer' | 'code'>('story');

  const storySteps: StoryStep[] = [
    {
      title: "The Wise Librarian's Challenge",
      description: "Our librarian faces a daunting task: finding 'Jane Eyre' among thousands of alphabetically sorted books. Rather than checking each book one by one, she employs an ancient technique passed down through generations of librarians.",
      code: `function binarySearch(books, target) {
  let left = 0;
  let right = books.length - 1;
  
  while (left <= right) {
    // Find the middle book
    let mid = Math.floor((left + right) / 2);`,
      highlight: [0, 1, 2, 4, 5]
    },
    {
      title: "The Middle Path",
      description: "The librarian walks to the exact center of the remaining books. She picks up the middle book and examines its title. This single comparison will eliminate half of all remaining possibilities!",
      code: `    // Check if we found our target
    if (books[mid] === target) {
      return mid; // Found it!
    }`,
      highlight: [6, 7, 8]
    },
    {
      title: "The Great Division",
      description: "If the middle book comes alphabetically before our target, the librarian knows our book must be in the right half. If it comes after, the book must be in the left half. She discards the impossible half entirely.",
      code: `    // Decide which half to explore
    if (books[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1; // Search left half
    }`,
      highlight: [9, 10, 11, 12, 13]
    },
    {
      title: "The Discovery",
      description: "The librarian repeats this process, each time cutting the search space in half. With each step, she gets closer to the target. Finally, she finds 'Jane Eyre' exactly where it should be!",
      code: `  }
  return -1; // Not found
}

// The magic happens: O(log n) time!
// 1000 books? Only 10 steps maximum!`,
      highlight: [14, 15, 16, 17, 18]
    }
  ];

  const searchSteps = [
    { left: 0, right: 11, mid: 5, message: "Starting search. Middle book: 'Fahrenheit 451'" },
    { left: 6, right: 11, mid: 8, message: "'Jane Eyre' comes after 'Fahrenheit 451', searching right half. Middle book: 'Heart of Darkness'" },
    { left: 9, right: 11, mid: 10, message: "'Jane Eyre' comes after 'Heart of Darkness', searching right half. Middle book: 'Lord of the Flies'" },
    { left: 9, right: 9, mid: 9, message: "'Jane Eyre' comes before 'Lord of the Flies', searching left half. Found 'Jane Eyre'!" }
  ];

  useEffect(() => {
    if (isPlaying && currentStep < searchSteps.length - 1) {
      const timer = setTimeout(() => {
        const nextStep = searchSteps[currentStep + 1];
        setLeft(nextStep.left);
        setRight(nextStep.right);
        setMid(nextStep.mid);
        setCurrentStep(currentStep + 1);
        if (currentStep + 1 === searchSteps.length - 1) {
          setFound(true);
          setIsPlaying(false);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep]);

  const handlePlay = () => {
    if (currentStep >= searchSteps.length - 1) {
      handleReset();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setLeft(0);
    setRight(11);
    setMid(5);
    setFound(false);
    setIsPlaying(false);
  };

  const getBookStyle = (index: number) => {
    const isInRange = index >= left && index <= right;
    const isMiddle = index === mid;
    const isTarget = books[index] === target && found;
    
    return `
      h-20 w-16 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-500 cursor-pointer
      ${isTarget ? 'bg-green-500 text-white scale-110 shadow-lg' : 
        isMiddle ? 'bg-blue-500 text-white scale-105 shadow-md' :
        isInRange ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
        'bg-gray-200 text-gray-500 opacity-50'}
    `;
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Librarian's Quest</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  In a grand library with thousands of books arranged alphabetically, our wise librarian 
                  receives a request to find "Jane Eyre". Instead of starting from the beginning and 
                  checking each book one by one, she employs an elegant strategy that has been passed 
                  down through generations of librarians.
                </p>
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">The Ancient Technique</h3>
                  <p className="text-blue-800">
                    "Why search through thousands when you can eliminate half with a single glance?" 
                    the librarian thinks. She walks to the middle of the collection, picks up the 
                    center book, and compares it to her target. In one comparison, she eliminates 
                    half of all possibilities!
                  </p>
                </div>
                <p className="text-gray-600">
                  This is the essence of Binary Search - a divide-and-conquer algorithm that 
                  transforms a potentially exhausting linear search into an elegant dance of 
                  elimination. Each step cuts the problem in half, leading to the target with 
                  mathematical precision.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch the Story Unfold</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualizer' && (
          <div className="space-y-8">
            {/* Library Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">The Grand Library</h2>
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
                  {searchSteps[currentStep].message}
                </p>
              </div>

              {/* Book Shelf */}
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-6">
                {books.map((book, index) => (
                  <div
                    key={index}
                    className={getBookStyle(index)}
                    title={book}
                  >
                    <span className="text-center leading-tight">
                      {book.split(' ').map((word, i) => (
                        <div key={i} className="text-xs">{word}</div>
                      ))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Search Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Search Range</h3>
                  <p className="text-sm text-gray-600">
                    Left: {left}, Right: {right}
                  </p>
                  <p className="text-sm text-gray-600">
                    Books remaining: {right - left + 1}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Current Middle</h3>
                  <p className="text-sm text-blue-800">
                    Position: {mid}
                  </p>
                  <p className="text-sm text-blue-800">
                    Book: "{books[mid]}"
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Progress</h3>
                  <p className="text-sm text-green-800">
                    Step: {currentStep + 1} / {searchSteps.length}
                  </p>
                  <p className="text-sm text-green-800">
                    Status: {found ? 'Found!' : 'Searching...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Current Middle</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 border-2 border-blue-300 rounded"></div>
                  <span className="text-sm text-gray-600">Search Range</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Target Found</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded opacity-50"></div>
                  <span className="text-sm text-gray-600">Eliminated</span>
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
                  <code>{`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Find the middle index
    let mid = Math.floor((left + right) / 2);
    
    // Check if we found the target
    if (arr[mid] === target) {
      return mid; // Found it!
    }
    
    // Decide which half to search
    if (arr[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}

// Example usage:
const books = [
  'Alice in Wonderland', 'Brave New World', 'Catch-22', 
  'Don Quixote', 'Emma', 'Fahrenheit 451', 'Great Expectations', 
  'Heart of Darkness', 'Jane Eyre', 'King Lear', 
  'Lord of the Flies', 'Moby Dick'
];

const result = binarySearch(books, 'Jane Eyre');
console.log(result); // Output: 8 (index of 'Jane Eyre')

// Time Complexity: O(log n)
// Space Complexity: O(1)
// Perfect for sorted arrays!`}</code>
                </pre>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Time Complexity</h3>
                  <p className="text-blue-800 mb-2">O(log n)</p>
                  <p className="text-blue-700 text-sm">
                    With each comparison, we eliminate half of the remaining elements. 
                    For 1,000 elements, we need at most 10 comparisons!
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Space Complexity</h3>
                  <p className="text-green-800 mb-2">O(1)</p>
                  <p className="text-green-700 text-sm">
                    We only use a constant amount of extra memory regardless of input size.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;