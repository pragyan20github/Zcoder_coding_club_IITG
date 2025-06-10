import React, { useState } from "react";
import { Tag, Play, ArrowLeft, Bookmark, Check } from "lucide-react";

const CodeEditor = ({ problem, onBack, onToggleBookmark }) => {
  const [codeInput, setCodeInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  if (!problem) return null;

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running code...");

    setTimeout(() => {
      setOutput(
        `Output for ${problem.title}:\n\nTest case 1: Passed ✓\nTest case 2: Passed ✓\nTest case 3: Failed ✗\n\nExecution time: 42ms\nMemory usage: 12.5MB`
      );
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">{problem.title}</h2>
            <span
              className={`px-2 py-1 text-xs rounded ${
                problem.difficulty === "Easy"
                  ? "bg-green-100 text-green-800"
                  : problem.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {problem.difficulty}
            </span>
            {problem.solved && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                ✓ Solved
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleBookmark(problem.id)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                problem.bookmarked
                  ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"
              }`}
              title={problem.bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {problem.bookmarked ? (
                <div className="flex items-center relative">
                  <Bookmark className="w-4 h-4 fill-current" />
                  <Check className="w-2 h-2 absolute ml-1 mt-1" />
                </div>
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="text-sm">
                {problem.bookmarked ? "Bookmarked" : "Bookmark"}
              </span>
            </button>
            <button
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Problems</span>
            </button>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{problem.description}</p>
        <div className="flex items-center space-x-2">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded flex items-center"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Code Editor</h3>
            <div className="flex items-center space-x-2">
              <select
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>C++</option>
              </select>
              <button
                className={`flex items-center space-x-1 px-3 py-1 text-white rounded text-sm transition-colors ${
                  isRunning
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{isRunning ? "Running..." : "Run"}</span>
              </button>
            </div>
          </div>
          <div className="p-4">
            <textarea
              className="w-full h-64 font-mono text-sm border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={`// Write your ${selectedLanguage} solution here...\nfunction solution() {\n    // Your code here\n}`}
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {problem.solution && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold">Community Solution</h3>
              </div>
              <div className="p-4">
                <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto border">
                  <code>{problem.solution}</code>
                </pre>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold">Test Output</h3>
            </div>
            <div className="p-4">
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm min-h-[120px]">
                {output || 'Click "Run" to see output...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
