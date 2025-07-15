import React, { useState } from 'react';
import { ArrowLeft, Play, Plus, Minus, RotateCcw, BookOpen, Code, ChevronRight } from 'lucide-react';

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

const StackVisualizer: React.FC<Props> = ({ algorithm, onBack }) => {
  const [stack, setStack] = useState<string[]>(['Dinner Plate', 'Salad Plate', 'Soup Bowl']);
  const [inputValue, setInputValue] = useState('');
  const [currentView, setCurrentView] = useState<'story' | 'visualizer' | 'code'>('story');
  const [lastAction, setLastAction] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  const plateTypes = [
    'Dinner Plate', 'Salad Plate', 'Soup Bowl', 'Dessert Plate', 'Bread Plate',
    'Serving Platter', 'Cake Plate', 'Appetizer Plate', 'Charger Plate'
  ];

  const handlePush = () => {
    if (inputValue.trim() && !isAnimating) {
      setIsAnimating(true);
      setStack(prev => [...prev, inputValue.trim()]);
      setLastAction(`Pushed: ${inputValue.trim()}`);
      setInputValue('');
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handlePop = () => {
    if (stack.length > 0 && !isAnimating) {
      setIsAnimating(true);
      const poppedItem = stack[stack.length - 1];
      setStack(prev => prev.slice(0, -1));
      setLastAction(`Popped: ${poppedItem}`);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handlePeek = () => {
    if (stack.length > 0) {
      const topItem = stack[stack.length - 1];
      setLastAction(`Peeked: ${topItem} (top item)`);
    } else {
      setLastAction('Stack is empty - nothing to peek');
    }
  };

  const handleClear = () => {
    setStack([]);
    setLastAction('Stack cleared - ready for new plates');
  };

  const addRandomPlate = () => {
    const randomPlate = plateTypes[Math.floor(Math.random() * plateTypes.length)];
    setInputValue(randomPlate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
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
                    currentView === 'story' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Story
                </button>
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'visualizer' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Visualizer
                </button>
                <button
                  onClick={() => setCurrentView('code')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'code' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Busy Kitchen's Perfect System</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  In the heart of a bustling restaurant, the kitchen operates with clockwork precision. 
                  The dishwasher has discovered the perfect system for managing clean plates: stack them 
                  high, and always take from the top. This simple rule ensures that the last plate 
                  washed is the first plate served.
                </p>
                <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-3">The LIFO Principle</h3>
                  <p className="text-indigo-800">
                    "Last In, First Out," the head chef explains to the new staff. "When you add a 
                    plate to the stack, it goes on top. When you need a plate, you take from the top. 
                    This way, we maintain order in the chaos of dinner service, and every plate gets 
                    used efficiently."
                  </p>
                </div>
                <p className="text-gray-600">
                  This is the essence of a Stack - a fundamental data structure that follows the 
                  Last-In-First-Out (LIFO) principle. Like the kitchen's plate system, stacks are 
                  perfect for managing temporary data, function calls, and any situation where you 
                  need to reverse the order of operations.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Experience the Kitchen Stack</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualizer' && (
          <div className="space-y-8">
            {/* Kitchen Stack Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">The Kitchen Stack</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Stack Size: {stack.length}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Stack Visualization */}
                <div className="bg-gradient-to-b from-indigo-100 to-purple-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Plate Stack</h3>
                  <div className="flex flex-col-reverse items-center space-y-reverse space-y-2 min-h-[300px] justify-end">
                    {stack.map((plate, index) => (
                      <div
                        key={index}
                        className={`w-32 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-300 ${
                          index === stack.length - 1 ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                        } ${isAnimating && index === stack.length - 1 ? 'scale-110' : ''}`}
                        style={{
                          transform: `translateY(${index * -2}px)`,
                          zIndex: index
                        }}
                      >
                        {plate}
                      </div>
                    ))}
                    {stack.length === 0 && (
                      <div className="text-gray-400 text-center py-20">
                        <div className="text-4xl mb-2">🍽️</div>
                        <p>Stack is empty</p>
                        <p className="text-sm">Add some plates!</p>
                      </div>
                    )}
                  </div>
                  {stack.length > 0 && (
                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-600">
                        Top: <span className="font-semibold text-indigo-600">{stack[stack.length - 1]}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stack Operations</h3>
                    
                    {/* Push Operation */}
                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-green-900 mb-2">Push (Add Plate)</h4>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Enter plate type..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onKeyPress={(e) => e.key === 'Enter' && handlePush()}
                        />
                        <button
                          onClick={addRandomPlate}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          title="Add random plate"
                        >
                          🎲
                        </button>
                        <button
                          onClick={handlePush}
                          disabled={!inputValue.trim() || isAnimating}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Push</span>
                        </button>
                      </div>
                    </div>

                    {/* Other Operations */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={handlePop}
                        disabled={stack.length === 0 || isAnimating}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1"
                      >
                        <Minus className="w-4 h-4" />
                        <span>Pop</span>
                      </button>
                      <button
                        onClick={handlePeek}
                        disabled={stack.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Peek
                      </button>
                      <button
                        onClick={handleClear}
                        disabled={stack.length === 0}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>

                  {/* Last Action */}
                  {lastAction && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">Last Action</h4>
                      <p className="text-yellow-800">{lastAction}</p>
                    </div>
                  )}

                  {/* Stack Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Stack Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Size: {stack.length} plates</p>
                      <p>Is Empty: {stack.length === 0 ? 'Yes' : 'No'}</p>
                      <p>Top Element: {stack.length > 0 ? stack[stack.length - 1] : 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stack Operations Guide</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Push</h4>
                  <p className="text-green-700 text-sm">Add an element to the top of the stack. O(1) time complexity.</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Pop</h4>
                  <p className="text-red-700 text-sm">Remove and return the top element. O(1) time complexity.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Peek/Top</h4>
                  <p className="text-blue-700 text-sm">View the top element without removing it. O(1) time complexity.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">isEmpty</h4>
                  <p className="text-purple-700 text-sm">Check if the stack is empty. O(1) time complexity.</p>
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
                  <code>{`class Stack {
  constructor() {
    this.items = [];
  }
  
  // Add element to top of stack
  push(element) {
    this.items.push(element);
  }
  
  // Remove and return top element
  pop() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items.pop();
  }
  
  // View top element without removing
  peek() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items[this.items.length - 1];
  }
  
  // Check if stack is empty
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Get stack size
  size() {
    return this.items.length;
  }
  
  // Clear all elements
  clear() {
    this.items = [];
  }
  
  // Convert to array (for debugging)
  toArray() {
    return [...this.items];
  }
}

// Example usage:
const plateStack = new Stack();

// Add plates to the stack
plateStack.push("Dinner Plate");
plateStack.push("Salad Plate");
plateStack.push("Soup Bowl");

console.log("Stack size:", plateStack.size()); // 3
console.log("Top plate:", plateStack.peek()); // "Soup Bowl"

// Remove plates (LIFO order)
console.log("Removed:", plateStack.pop()); // "Soup Bowl"
console.log("Removed:", plateStack.pop()); // "Salad Plate"

console.log("Is empty:", plateStack.isEmpty()); // false
console.log("Remaining:", plateStack.toArray()); // ["Dinner Plate"]

// Real-world applications:
// 1. Function call stack
// 2. Undo operations in editors
// 3. Expression evaluation
// 4. Browser history
// 5. Backtracking algorithms

// Time Complexity: All operations are O(1)
// Space Complexity: O(n) where n is number of elements`}</code>
                </pre>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Time Complexity</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Push: O(1)</li>
                    <li>• Pop: O(1)</li>
                    <li>• Peek: O(1)</li>
                    <li>• isEmpty: O(1)</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">Common Applications</h3>
                  <ul className="text-indigo-700 text-sm space-y-1">
                    <li>• Function call management</li>
                    <li>• Undo/Redo operations</li>
                    <li>• Expression parsing</li>
                    <li>• Browser navigation history</li>
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

export default StackVisualizer;