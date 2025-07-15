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

const QueueVisualizer: React.FC<Props> = ({ algorithm, onBack }) => {
  const [queue, setQueue] = useState<string[]>(['Baker Tom', 'Mrs. Smith', 'Young Peter']);
  const [inputValue, setInputValue] = useState('');
  const [currentView, setCurrentView] = useState<'story' | 'visualizer' | 'code'>('story');
  const [lastAction, setLastAction] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  const customerNames = [
    'Baker Tom', 'Mrs. Smith', 'Young Peter', 'Old Martha', 'Farmer John',
    'Teacher Mary', 'Doctor Brown', 'Chef Alice', 'Artist Bob', 'Student Emma'
  ];

  const handleEnqueue = () => {
    if (inputValue.trim() && !isAnimating) {
      setIsAnimating(true);
      setQueue(prev => [...prev, inputValue.trim()]);
      setLastAction(`${inputValue.trim()} joined the queue`);
      setInputValue('');
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleDequeue = () => {
    if (queue.length > 0 && !isAnimating) {
      setIsAnimating(true);
      const servedCustomer = queue[0];
      setQueue(prev => prev.slice(1));
      setLastAction(`${servedCustomer} was served and left the queue`);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleFront = () => {
    if (queue.length > 0) {
      setLastAction(`Next to be served: ${queue[0]}`);
    } else {
      setLastAction('Queue is empty - no customers waiting');
    }
  };

  const handleClear = () => {
    setQueue([]);
    setLastAction('Queue cleared - bakery is closing');
  };

  const addRandomCustomer = () => {
    const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
    setInputValue(randomCustomer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
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
                    currentView === 'story' ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Story
                </button>
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'visualizer' ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Visualizer
                </button>
                <button
                  onClick={() => setCurrentView('code')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'code' ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:text-gray-900'
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Village Bakery's Fair System</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  Every morning at dawn, the aroma of fresh bread draws villagers to the local bakery. 
                  As customers arrive, they naturally form a line - the first person to arrive gets 
                  served first, and newcomers join at the back. This simple, fair system ensures 
                  everyone gets their turn in the order they arrived.
                </p>
                <div className="bg-teal-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-teal-900 mb-3">The FIFO Principle</h3>
                  <p className="text-teal-800">
                    "First In, First Out," explains the kindly baker. "The first customer to join 
                    the line is the first to be served. New customers join at the back, and I 
                    serve from the front. This way, everyone is treated fairly, and no one can 
                    complain about cutting in line!"
                  </p>
                </div>
                <p className="text-gray-600">
                  This is the essence of a Queue - a fundamental data structure that follows the 
                  First-In-First-Out (FIFO) principle. Like the bakery line, queues are perfect 
                  for managing tasks that need to be processed in order, ensuring fairness and 
                  maintaining the sequence of operations.
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentView('visualizer')}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Join the Bakery Queue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'visualizer' && (
          <div className="space-y-8">
            {/* Bakery Queue Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">The Village Bakery Queue</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Queue Length: {queue.length}</span>
                </div>
              </div>

              <div className="space-y-8">
                {/* Queue Visualization */}
                <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-semibold text-teal-800">← FRONT (Next to be served)</div>
                    <div className="text-sm font-semibold text-teal-800">BACK (New customers join) →</div>
                  </div>
                  
                  <div className="flex items-center space-x-3 min-h-[80px] overflow-x-auto">
                    {queue.length === 0 ? (
                      <div className="flex-1 text-center text-gray-400 py-8">
                        <div className="text-4xl mb-2">🏪</div>
                        <p>No customers in queue</p>
                        <p className="text-sm">The bakery is quiet...</p>
                      </div>
                    ) : (
                      queue.map((customer, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 w-24 h-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-md transition-all duration-300 ${
                            index === 0 ? 'ring-4 ring-yellow-400 ring-opacity-50 scale-105' : ''
                          } ${isAnimating && (index === 0 || index === queue.length - 1) ? 'scale-110' : ''}`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">👤</div>
                            <div className="leading-tight">{customer}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {queue.length > 0 && (
                    <div className="flex justify-between mt-4 text-sm text-teal-700">
                      <div>Next: <span className="font-semibold">{queue[0]}</span></div>
                      <div>Last: <span className="font-semibold">{queue[queue.length - 1]}</span></div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Queue Operations</h3>
                    
                    {/* Enqueue Operation */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Enqueue (Join Queue)</h4>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Enter customer name..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
                        />
                        <button
                          onClick={addRandomCustomer}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          title="Add random customer"
                        >
                          🎲
                        </button>
                        <button
                          onClick={handleEnqueue}
                          disabled={!inputValue.trim() || isAnimating}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Join</span>
                        </button>
                      </div>
                    </div>

                    {/* Other Operations */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={handleDequeue}
                        disabled={queue.length === 0 || isAnimating}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1"
                      >
                        <Minus className="w-4 h-4" />
                        <span>Serve</span>
                      </button>
                      <button
                        onClick={handleFront}
                        disabled={queue.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                      <button
                        onClick={handleClear}
                        disabled={queue.length === 0}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Last Action */}
                    {lastAction && (
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">Bakery News</h4>
                        <p className="text-yellow-800">{lastAction}</p>
                      </div>
                    )}

                    {/* Queue Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Queue Information</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Length: {queue.length} customers</p>
                        <p>Is Empty: {queue.length === 0 ? 'Yes' : 'No'}</p>
                        <p>Front Customer: {queue.length > 0 ? queue[0] : 'None'}</p>
                        <p>Back Customer: {queue.length > 0 ? queue[queue.length - 1] : 'None'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operations Guide */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Operations Guide</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Enqueue</h4>
                  <p className="text-green-700 text-sm">Add an element to the back of the queue. O(1) time complexity.</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Dequeue</h4>
                  <p className="text-red-700 text-sm">Remove and return the front element. O(1) time complexity.</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Front</h4>
                  <p className="text-blue-700 text-sm">View the front element without removing it. O(1) time complexity.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">isEmpty</h4>
                  <p className="text-purple-700 text-sm">Check if the queue is empty. O(1) time complexity.</p>
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
                  <code>{`class Queue {
  constructor() {
    this.items = [];
  }
  
  // Add element to back of queue
  enqueue(element) {
    this.items.push(element);
  }
  
  // Remove and return front element
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items.shift();
  }
  
  // View front element without removing
  front() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items[0];
  }
  
  // View back element without removing
  back() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items[this.items.length - 1];
  }
  
  // Check if queue is empty
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Get queue size
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

// More efficient implementation using circular buffer
class CircularQueue {
  constructor(capacity = 10) {
    this.items = new Array(capacity);
    this.front = 0;
    this.rear = 0;
    this.size = 0;
    this.capacity = capacity;
  }
  
  enqueue(element) {
    if (this.size === this.capacity) {
      throw new Error("Queue is full");
    }
    this.items[this.rear] = element;
    this.rear = (this.rear + 1) % this.capacity;
    this.size++;
  }
  
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const element = this.items[this.front];
    this.items[this.front] = undefined;
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return element;
  }
  
  isEmpty() {
    return this.size === 0;
  }
  
  isFull() {
    return this.size === this.capacity;
  }
}

// Example usage:
const bakeryQueue = new Queue();

// Customers join the queue
bakeryQueue.enqueue("Baker Tom");
bakeryQueue.enqueue("Mrs. Smith");
bakeryQueue.enqueue("Young Peter");

console.log("Queue size:", bakeryQueue.size()); // 3
console.log("Next customer:", bakeryQueue.front()); // "Baker Tom"

// Serve customers (FIFO order)
console.log("Served:", bakeryQueue.dequeue()); // "Baker Tom"
console.log("Served:", bakeryQueue.dequeue()); // "Mrs. Smith"

console.log("Is empty:", bakeryQueue.isEmpty()); // false
console.log("Remaining:", bakeryQueue.toArray()); // ["Young Peter"]

// Real-world applications:
// 1. Task scheduling in operating systems
// 2. Print job management
// 3. Breadth-first search in graphs
// 4. Handling requests in web servers
// 5. Buffer for data streams

// Time Complexity: All operations are O(1)
// Space Complexity: O(n) where n is number of elements`}</code>
                </pre>
              </div>
              
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Time Complexity</h3>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Enqueue: O(1)</li>
                    <li>• Dequeue: O(1) with circular buffer</li>
                    <li>• Front: O(1)</li>
                    <li>• isEmpty: O(1)</li>
                  </ul>
                </div>
                <div className="bg-teal-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-teal-900 mb-3">Common Applications</h3>
                  <ul className="text-teal-700 text-sm space-y-1">
                    <li>• Process scheduling</li>
                    <li>• Print queue management</li>
                    <li>• Breadth-first search</li>
                    <li>• Request handling in servers</li>
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

export default QueueVisualizer;