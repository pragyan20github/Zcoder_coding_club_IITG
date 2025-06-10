// src/services/problemApi.js

class ProblemService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
    this.allProblems = []; // Store all problems for search
    this.initialized = false;
  }

  // Initialize with comprehensive problem set
  async initialize() {
    if (this.initialized) return;

    try {
      this.allProblems = await this.fetchAllProblems();
      this.initialized = true;
      console.log(
        "Problem service initialized with",
        this.allProblems.length,
        "problems"
      );
    } catch (error) {
      console.error("Failed to initialize problem service:", error);
      this.allProblems = this.getExtensiveFallbackProblems();
      this.initialized = true;
    }
  }

  // Fetch comprehensive problem set
  async fetchAllProblems() {
    // Since external APIs are unreliable, we'll use a comprehensive local dataset
    return this.getExtensiveFallbackProblems();
  }

  // Get all problems
  async getAllProblems(limit = 100) {
    await this.initialize();
    return this.allProblems.slice(0, limit);
  }

  // Search problems by keyword - FIXED IMPLEMENTATION
  async searchProblems(keyword) {
    await this.initialize();

    if (!keyword || keyword.trim().length < 2) {
      console.log("No keyword provided, returning all problems");
      return this.allProblems.slice(0, 50);
    }

    const searchTerm = keyword.toLowerCase().trim();
    console.log("Searching for keyword:", searchTerm);

    const results = this.allProblems.filter((problem) => {
      const titleMatch = problem.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = problem.description
        .toLowerCase()
        .includes(searchTerm);
      const tagMatch = problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm)
      );
      const difficultyMatch = problem.difficulty
        .toLowerCase()
        .includes(searchTerm);

      return titleMatch || descriptionMatch || tagMatch || difficultyMatch;
    });

    console.log(`Found ${results.length} problems matching "${keyword}"`);
    return results;
  }

  // Filter by difficulty
  async getProblemsByDifficulty(difficulty) {
    await this.initialize();

    if (difficulty === "All") {
      return this.allProblems.slice(0, 100);
    }

    const results = this.allProblems.filter(
      (p) => p.difficulty.toLowerCase() === difficulty.toLowerCase()
    );

    console.log(`Found ${results.length} ${difficulty} problems`);
    return results;
  }

  // Get random problem
  async getRandomProblem() {
    await this.initialize();
    const randomIndex = Math.floor(Math.random() * this.allProblems.length);
    return this.allProblems[randomIndex];
  }

  // Get daily challenge
  async getDailyChallenge() {
    await this.initialize();
    // Use a deterministic random based on current date
    const today = new Date().toDateString();
    const seed = today.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    const index = seed % this.allProblems.length;
    return this.allProblems[index];
  }

  // Get problem statistics
  async getProblemStats() {
    await this.initialize();

    const stats = {
      total: this.allProblems.length,
      easy: this.allProblems.filter((p) => p.difficulty === "Easy").length,
      medium: this.allProblems.filter((p) => p.difficulty === "Medium").length,
      hard: this.allProblems.filter((p) => p.difficulty === "Hard").length,
      tags: [...new Set(this.allProblems.flatMap((p) => p.tags))],
    };

    return stats;
  }

  // Extensive fallback problems dataset
  getExtensiveFallbackProblems() {
    return [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 15420,
        likes: 8932,
        slug: "two-sum",
        isPaidOnly: false,
        acceptance: "49.1%",
      },
      {
        id: 2,
        title: "Add Two Numbers",
        difficulty: "Medium",
        tags: ["Linked List", "Math", "Recursion"],
        description:
          "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 8234,
        likes: 6543,
        slug: "add-two-numbers",
        isPaidOnly: false,
        acceptance: "35.2%",
      },
      {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Sliding Window"],
        description:
          "Given a string s, find the length of the longest substring without repeating characters. A substring is a contiguous sequence of characters within a string.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 7821,
        likes: 5432,
        slug: "longest-substring-without-repeating-characters",
        isPaidOnly: false,
        acceptance: "33.8%",
      },
      {
        id: 4,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        description:
          "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 5432,
        likes: 3210,
        slug: "median-of-two-sorted-arrays",
        isPaidOnly: false,
        acceptance: "35.1%",
      },
      {
        id: 5,
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        tags: ["String", "Dynamic Programming"],
        description:
          "Given a string s, return the longest palindromic substring in s. A palindrome reads the same backward as forward.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 6789,
        likes: 4321,
        slug: "longest-palindromic-substring",
        isPaidOnly: false,
        acceptance: "32.4%",
      },
      {
        id: 6,
        title: "ZigZag Conversion",
        difficulty: "Medium",
        tags: ["String"],
        description:
          "The string 'PAYPALISHIRING' is written in a zigzag pattern on a given number of rows. Write the code that will take a string and make this conversion given a number of rows.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 4567,
        likes: 2890,
        slug: "zigzag-conversion",
        isPaidOnly: false,
        acceptance: "41.2%",
      },
      {
        id: 7,
        title: "Reverse Integer",
        difficulty: "Medium",
        tags: ["Math"],
        description:
          "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range, then return 0.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 3456,
        likes: 1234,
        slug: "reverse-integer",
        isPaidOnly: false,
        acceptance: "26.8%",
      },
      {
        id: 8,
        title: "String to Integer (atoi)",
        difficulty: "Medium",
        tags: ["String"],
        description:
          "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer (similar to C/C++'s atoi function).",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 2345,
        likes: 987,
        slug: "string-to-integer-atoi",
        isPaidOnly: false,
        acceptance: "16.4%",
      },
      {
        id: 9,
        title: "Palindrome Number",
        difficulty: "Easy",
        tags: ["Math"],
        description:
          "Given an integer x, return true if x is palindrome integer. An integer is a palindrome when it reads the same backward as forward.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 5678,
        likes: 3456,
        slug: "palindrome-number",
        isPaidOnly: false,
        acceptance: "52.1%",
      },
      {
        id: 10,
        title: "Regular Expression Matching",
        difficulty: "Hard",
        tags: ["String", "Dynamic Programming", "Recursion"],
        description:
          "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 1234,
        likes: 567,
        slug: "regular-expression-matching",
        isPaidOnly: false,
        acceptance: "27.9%",
      },
      {
        id: 11,
        title: "Container With Most Water",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers", "Greedy"],
        description:
          "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that contains the most water.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 4321,
        likes: 2345,
        slug: "container-with-most-water",
        isPaidOnly: false,
        acceptance: "54.2%",
      },
      {
        id: 12,
        title: "Integer to Roman",
        difficulty: "Medium",
        tags: ["Hash Table", "Math", "String"],
        description:
          "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given an integer, convert it to a roman numeral.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 3210,
        likes: 1876,
        slug: "integer-to-roman",
        isPaidOnly: false,
        acceptance: "58.9%",
      },
      {
        id: 13,
        title: "Roman to Integer",
        difficulty: "Easy",
        tags: ["Hash Table", "Math", "String"],
        description:
          "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given a roman numeral, convert it to an integer.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 6543,
        likes: 4321,
        slug: "roman-to-integer",
        isPaidOnly: false,
        acceptance: "58.1%",
      },
      {
        id: 14,
        title: "Longest Common Prefix",
        difficulty: "Easy",
        tags: ["String"],
        description:
          "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 4567,
        likes: 2890,
        slug: "longest-common-prefix",
        isPaidOnly: false,
        acceptance: "40.1%",
      },
      {
        id: 15,
        title: "3Sum",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers", "Sorting"],
        description:
          "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 8765,
        likes: 5432,
        slug: "3sum",
        isPaidOnly: false,
        acceptance: "32.1%",
      },
      {
        id: 16,
        title: "3Sum Closest",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers", "Sorting"],
        description:
          "Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 3456,
        likes: 2109,
        slug: "3sum-closest",
        isPaidOnly: false,
        acceptance: "46.2%",
      },
      {
        id: 17,
        title: "Letter Combinations of a Phone Number",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Backtracking"],
        description:
          "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 5432,
        likes: 3210,
        slug: "letter-combinations-of-a-phone-number",
        isPaidOnly: false,
        acceptance: "55.8%",
      },
      {
        id: 18,
        title: "4Sum",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers", "Sorting"],
        description:
          "Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that nums[a] + nums[b] + nums[c] + nums[d] == target.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 2345,
        likes: 1456,
        slug: "4sum",
        isPaidOnly: false,
        acceptance: "35.4%",
      },
      {
        id: 19,
        title: "Remove Nth Node From End of List",
        difficulty: "Medium",
        tags: ["Linked List", "Two Pointers"],
        description:
          "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 4321,
        likes: 2876,
        slug: "remove-nth-node-from-end-of-list",
        isPaidOnly: false,
        acceptance: "38.9%",
      },
      {
        id: 20,
        title: "Valid Parentheses",
        difficulty: "Easy",
        tags: ["String", "Stack"],
        description:
          "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if brackets are opened and closed in the correct order.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 7654,
        likes: 4987,
        slug: "valid-parentheses",
        isPaidOnly: false,
        acceptance: "40.7%",
      },
      {
        id: 21,
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        tags: ["Linked List", "Recursion"],
        description:
          "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 5432,
        likes: 3654,
        slug: "merge-two-sorted-lists",
        isPaidOnly: false,
        acceptance: "61.2%",
      },
      {
        id: 22,
        title: "Generate Parentheses",
        difficulty: "Medium",
        tags: ["String", "Dynamic Programming", "Backtracking"],
        description:
          "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 4567,
        likes: 3210,
        slug: "generate-parentheses",
        isPaidOnly: false,
        acceptance: "70.1%",
      },
      {
        id: 23,
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        tags: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"],
        description:
          "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 3456,
        likes: 2109,
        slug: "merge-k-sorted-lists",
        isPaidOnly: false,
        acceptance: "47.8%",
      },
      {
        id: 24,
        title: "Swap Nodes in Pairs",
        difficulty: "Medium",
        tags: ["Linked List", "Recursion"],
        description:
          "Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 2345,
        likes: 1567,
        slug: "swap-nodes-in-pairs",
        isPaidOnly: false,
        acceptance: "58.4%",
      },
      {
        id: 25,
        title: "Reverse Nodes in k-Group",
        difficulty: "Hard",
        tags: ["Linked List", "Recursion"],
        description:
          "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 1234,
        likes: 876,
        slug: "reverse-nodes-in-k-group",
        isPaidOnly: false,
        acceptance: "51.2%",
      },
    ];
  }
}

// Export singleton instance
export const problemService = new ProblemService();
export default problemService;
