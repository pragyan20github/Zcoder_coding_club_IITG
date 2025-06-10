export const currentUser = {
  id: 1,
  name: "Alex Chen",
  username: "alexcoder",
  avatar: "AC",
  bio: "Full-stack developer passionate about algorithms and clean code",
  level: "Advanced",
  streak: 15,
  solvedProblems: 127,
  contributions: 45,
};

export const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    bookmarked: true,
    solved: true,
    solution:
      "// JavaScript Solution\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    comments: 12,
    likes: 45,
  },
  {
    id: 2,
    title: "Binary Tree Traversal",
    difficulty: "Medium",
    tags: ["Trees", "DFS", "Recursion"],
    description:
      "Implement inorder, preorder, and postorder traversal of a binary tree.",
    bookmarked: false,
    solved: false,
    solution: "",
    comments: 8,
    likes: 23,
  },
  {
    id: 3,
    title: "Dynamic Programming - Fibonacci",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Recursion"],
    description:
      "Calculate the nth Fibonacci number using dynamic programming approach.",
    bookmarked: true,
    solved: true,
    solution:
      "// Optimized DP Solution\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  let prev = 0, curr = 1;\n  for (let i = 2; i <= n; i++) {\n    let temp = curr;\n    curr = prev + curr;\n    prev = temp;\n  }\n  return curr;\n}",
    comments: 15,
    likes: 67,
  },
  {
    id: 4,
    title: "Merge Sort Implementation",
    difficulty: "Medium",
    tags: ["Sorting", "Divide and Conquer"],
    description:
      "Implement the merge sort algorithm to sort an array of integers.",
    bookmarked: false,
    solved: false,
    solution: "",
    comments: 6,
    likes: 34,
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    bookmarked: true,
    solved: true,
    solution:
      "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  \n  for (let char of s) {\n    if (char in map) {\n      if (stack.pop() !== map[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  \n  return stack.length === 0;\n}",
    comments: 20,
    likes: 89,
  },
];

export const rooms = [
  {
    id: 1,
    name: "Algorithm Masters",
    members: 24,
    topic: "Dynamic Programming",
    active: true,
  },
  {
    id: 2,
    name: "Interview Prep",
    members: 18,
    topic: "System Design",
    active: true,
  },
  {
    id: 3,
    name: "Beginner's Circle",
    members: 32,
    topic: "Basic Data Structures",
    active: false,
  },
  {
    id: 4,
    name: "Competitive Coding",
    members: 15,
    topic: "Contest Problems",
    active: true,
  },
  {
    id: 5,
    name: "JavaScript Ninjas",
    members: 27,
    topic: "Web Development",
    active: false,
  },
  {
    id: 6,
    name: "Python Enthusiasts",
    members: 21,
    topic: "Machine Learning",
    active: true,
  },
];

export const recentActivities = [
  {
    id: 1,
    type: "solved",
    message: 'Solved "Two Sum" problem',
    time: "2 hours ago",
    color: "green",
  },
  {
    id: 2,
    type: "liked",
    message: "Received 5 likes on your solution",
    time: "5 hours ago",
    color: "blue",
  },
  {
    id: 3,
    type: "joined",
    message: 'Joined collaborative room "Algorithm Masters"',
    time: "1 day ago",
    color: "purple",
  },
];

export const achievements = [
  {
    id: 1,
    icon: "🏆",
    title: "Problem Solver",
    description: "Solved 100+ problems",
    color: "yellow",
  },
  {
    id: 2,
    icon: "🔥",
    title: "Streak Master",
    description: "15 day solving streak",
    color: "green",
  },
  {
    id: 3,
    icon: "👥",
    title: "Team Player",
    description: "Active in 5+ rooms",
    color: "purple",
  },
];

export const skills = [
  "JavaScript",
  "Python",
  "Algorithms",
  "Data Structures",
  "React",
  "Node.js",
  "MongoDB",
];
