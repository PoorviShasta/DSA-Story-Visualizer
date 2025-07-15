import React, { useState } from 'react';
import { BookOpen, Play, Code, Brain, ChevronRight, Search, BarChart, GitBranch, Route, Layers, TreePine, Hash, Zap, Target, Shuffle, ArrowUpDown, Network, Clock, Database } from 'lucide-react';
import BinarySearchVisualizer from './components/BinarySearchVisualizer';
import BubbleSortVisualizer from './components/BubbleSortVisualizer';
import MergeSortVisualizer from './components/MergeSortVisualizer';
import DijkstraVisualizer from './components/DijkstraVisualizer';
import QuickSortVisualizer from './components/QuickSortVisualizer';
import HeapSortVisualizer from './components/HeapSortVisualizer';
import LinearSearchVisualizer from './components/LinearSearchVisualizer';
import StackVisualizer from './components/StackVisualizer';
import QueueVisualizer from './components/QueueVisualizer';

type Algorithm = {
  id: string;
  title: string;
  description: string;
  story: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ReactNode;
  color: string;
  category: string;
};

const algorithms: Algorithm[] = [
  // Searching Algorithms
  {
    id: 'linear-search',
    title: 'Linear Search',
    description: 'The detective\'s methodical investigation',
    story: 'Follow Detective Holmes as he searches through evidence one clue at a time, leaving no stone unturned in his quest for truth.',
    difficulty: 'Beginner',
    icon: <Search className="w-6 h-6" />,
    color: 'from-blue-400 to-blue-600',
    category: 'Searching'
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'The librarian\'s clever book hunt',
    story: 'Join our librarian as they cleverly navigate through thousands of books using the ancient art of divide and conquer.',
    difficulty: 'Beginner',
    icon: <Search className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    category: 'Searching'
  },

  // Sorting Algorithms
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Watch bubbles rise to find their perfect place',
    story: 'In the depths of the ocean, bubbles must find their way to the surface, each one comparing with its neighbors.',
    difficulty: 'Beginner',
    icon: <BarChart className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    category: 'Sorting'
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    description: 'The art of organizing chaos through unity',
    story: 'Follow the journey of scattered papers as they find order through the power of systematic division and reunion.',
    difficulty: 'Intermediate',
    icon: <GitBranch className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    category: 'Sorting'
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    description: 'The swift warrior\'s battlefield strategy',
    story: 'Watch as a skilled commander organizes troops by choosing strategic pivot points and dividing forces efficiently.',
    difficulty: 'Intermediate',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    category: 'Sorting'
  },
  {
    id: 'heap-sort',
    title: 'Heap Sort',
    description: 'The mountain climber\'s peak conquest',
    story: 'Ascend the data mountain where the largest elements naturally rise to the top, creating perfect order.',
    difficulty: 'Advanced',
    icon: <Target className="w-6 h-6" />,
    color: 'from-red-500 to-pink-600',
    category: 'Sorting'
  },

  // Data Structures
  {
    id: 'stack',
    title: 'Stack (LIFO)',
    description: 'The tower of plates in a busy kitchen',
    story: 'Experience the organized chaos of a restaurant kitchen where plates are stacked and served in perfect last-in-first-out order.',
    difficulty: 'Beginner',
    icon: <Layers className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    category: 'Data Structures'
  },
  {
    id: 'queue',
    title: 'Queue (FIFO)',
    description: 'The fair line at the village bakery',
    story: 'Join the morning queue at the village bakery where fairness reigns supreme - first come, first served.',
    difficulty: 'Beginner',
    icon: <ArrowUpDown className="w-6 h-6" />,
    color: 'from-teal-500 to-cyan-500',
    category: 'Data Structures'
  }
];

const categories = [
  { name: 'All', color: 'from-gray-500 to-gray-600' },
  { name: 'Searching', color: 'from-blue-500 to-cyan-500' },
  { name: 'Sorting', color: 'from-green-500 to-emerald-500' },
  { name: 'Data Structures', color: 'from-indigo-500 to-purple-500' }
];

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'algorithms' | string>('home');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleAlgorithmSelect = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setCurrentView(algorithm.id);
  };

  const filteredAlgorithms = selectedCategory === 'All' 
    ? algorithms 
    : algorithms.filter(algo => algo.category === selectedCategory);

  const renderAlgorithmVisualizer = () => {
    if (!selectedAlgorithm) return null;

    const commonProps = {
      algorithm: selectedAlgorithm,
      onBack: () => setCurrentView('algorithms')
    };

    switch (selectedAlgorithm.id) {
      case 'linear-search':
        return <LinearSearchVisualizer {...commonProps} />;
      case 'binary-search':
        return <BinarySearchVisualizer {...commonProps} />;
      case 'bubble-sort':
        return <BubbleSortVisualizer {...commonProps} />;
      case 'merge-sort':
        return <MergeSortVisualizer {...commonProps} />;
      case 'quick-sort':
        return <QuickSortVisualizer {...commonProps} />;
      case 'heap-sort':
        return <HeapSortVisualizer {...commonProps} />;
      case 'stack':
        return <StackVisualizer {...commonProps} />;
      case 'queue':
        return <QueueVisualizer {...commonProps} />;
      default:
        return null;
    }
  };

  if (currentView !== 'home' && currentView !== 'algorithms') {
    return renderAlgorithmVisualizer();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DSA Story Visualizer
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'home' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('algorithms')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'algorithms' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Algorithms
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {currentView === 'home' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master DSA Through
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                Interactive Stories
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform complex algorithms and data structures into engaging narratives. Watch concepts come alive 
              through beautiful animations and compelling stories that make learning intuitive and memorable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentView('algorithms')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Learning</span>
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>View Documentation</span>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Story-Driven Learning</h3>
              <p className="text-gray-600">
                Each algorithm is presented as an engaging story with characters and scenarios that make abstract concepts relatable and memorable.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Visualizations</h3>
              <p className="text-gray-600">
                Step through algorithms at your own pace with smooth animations that highlight every decision and transformation.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real Code Examples</h3>
              <p className="text-gray-600">
                See how each algorithm translates to actual code with syntax highlighting and explanations for multiple programming languages.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{algorithms.length}</div>
              <div className="text-gray-600">Total Algorithms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length - 1}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">3</div>
              <div className="text-gray-600">Difficulty Levels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
              <div className="text-gray-600">Learning Potential</div>
            </div>
          </div>

          {/* Algorithm Categories Preview */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Complete DSA Coverage</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From basic searching and sorting to advanced dynamic programming and graph algorithms - master every essential concept.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms.slice(0, 6).map((algorithm) => (
              <div
                key={algorithm.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleAlgorithmSelect(algorithm)}
              >
                <div className={`bg-gradient-to-r ${algorithm.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                  {algorithm.icon}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{algorithm.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    algorithm.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    algorithm.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {algorithm.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{algorithm.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{algorithm.category}</span>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    <span>Start Story</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentView('algorithms')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>View All {algorithms.length} Algorithms</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      )}

      {currentView === 'algorithms' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Algorithm Adventure</h2>
            <p className="text-xl text-gray-600">
              Select an algorithm to begin your interactive learning journey
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedCategory === category.name
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 border border-gray-200 hover:shadow-md'
                }`}
              >
                {category.name}
                {category.name !== 'All' && (
                  <span className="ml-2 text-sm opacity-75">
                    ({algorithms.filter(algo => algo.category === category.name).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Algorithms Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlgorithms.map((algorithm) => (
              <div
                key={algorithm.id}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleAlgorithmSelect(algorithm)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`bg-gradient-to-r ${algorithm.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0`}>
                    {algorithm.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 truncate">{algorithm.title}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full flex-shrink-0 ml-2 ${
                        algorithm.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        algorithm.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {algorithm.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">{algorithm.description}</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{algorithm.story}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{algorithm.category}</span>
                      <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                        <span className="text-sm">Begin Story</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAlgorithms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No algorithms found</h3>
              <p className="text-gray-600">Try selecting a different category to explore more algorithms.</p>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;