"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';

// Mock data for assignments (title, questions)
const assignmentData = {
  '1': {
    title: 'React Fundamentals',
    questions: [
      {
        id: 1,
        text: 'Write a functional component that displays "Hello, React!" inside an h1 tag.',
        initialCode: `function Greeting() {\n  return <h1>Hello, React!</h1>;\n}\n\n// Render it\n// ReactDOM.createRoot(root).render(<Greeting />);\nconsole.log("Component defined");`,
      },
      {
        id: 2,
        text: 'Create a state variable "count" initialized to 0 and a button that increments it.',
        initialCode: `import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n\nconsole.log("Counter component ready");`,
      },
    ],
  },
  '2': {
    title: 'Python Data Structures',
    questions: [
      {
        id: 1,
        text: 'Create a list of numbers from 1 to 5 and print each number.',
        initialCode: `numbers = [1, 2, 3, 4, 5]\nfor n in numbers:\n    print(n)`,
      },
      {
        id: 2,
        text: 'Define a dictionary with keys "name" and "age", then print the age.',
        initialCode: `person = {"name": "Alice", "age": 25}\nprint(person["age"])`,
      },
    ],
  },
  // Add more assignments as needed
};

const AssignmentPage = () => {
  const { id } = useParams();
  const assignment = assignmentData[id];
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [code, setCode] = useState(assignment?.questions[0]?.initialCode || '// Write your code here');
  const [output, setOutput] = useState('');

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Assignment not found.</p>
      </div>
    );
  }

  const currentQuestion = assignment.questions[activeQuestion];

  const executeCode = () => {
    // Capture console.log output
    let logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(arg => String(arg)).join(' '));
      originalLog(...args);
    };

    try {
      // Use Function constructor to run code in a controlled scope
      const runnable = new Function(code);
      runnable();
      setOutput(logs.join('\n') || 'Code executed successfully (no console output).');
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      console.log = originalLog;
    }
  };

  const handleQuestionChange = (index  ) => {
    setActiveQuestion(index);   
    setCode(assignment.questions[index].initialCode || '// Write your code here');
    setOutput('');
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-200 mb-2">{assignment.title}</h1>
        <p className="text-gray-600 mb-8">Solve the questions below and test your code.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side: Questions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
              <h2 className="font-semibold text-gray-800">Questions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {assignment.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestionChange(idx)}
                  className={`w-full text-left px-6 py-4 transition-colors ${
                    activeQuestion === idx
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-gray-800">Question {idx + 1}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{q.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right side: Code Editor & Output */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">Code Editor</h2>
                <button
                  onClick={executeCode}
                  className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  Run ▶
                </button>
              </div>
              <div className="p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-80 font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                <h2 className="font-semibold text-gray-800">Output</h2>
              </div>
              <div className="p-4 font-mono text-sm bg-gray-900 text-gray-100 min-h-[150px]">
                <pre className="whitespace-pre-wrap">{output || 'Click "Run" to see output'}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;