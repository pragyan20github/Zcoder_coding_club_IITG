// src/services/leetcodeApi.js

// Using multiple API sources for better reliability
const API_SOURCES = [
  "https://leetcode-api-faisalshohag.vercel.app",
  "https://alfa-leetcode-api.onrender.com",
  "https://leetcode-api.vercel.app",
];

class LeetCodeService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
    this.currentApiIndex = 0;
  }

  // Get current API base URL
  getCurrentApiBase() {
    return API_SOURCES[this.currentApiIndex];
  }

  // Switch to next API if current one fails
  switchToNextApi() {
    this.currentApiIndex = (this.currentApiIndex + 1) % API_SOURCES.length;
  }

  // Enhanced fetch with retry logic
  async fetchWithRetry(url, maxRetries = 3) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: 10000,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error;
        console.warn(`API attempt ${attempt + 1} failed:`, error.message);

        if (attempt < maxRetries - 1) {
          this.switchToNextApi();
          // Update URL for next attempt
          url = url.replace(
            API_SOURCES[
              (this.currentApiIndex - 1 + API_SOURCES.length) %
                API_SOURCES.length
            ],
            this.getCurrentApiBase()
          );
        }
      }
    }

    throw lastError;
  }

  // Check if cached data is still valid
  isCacheValid(key) {
    const cached = this.cache.get(key);
    return cached && Date.now() - cached.timestamp < this.cacheExpiry;
  }

  // Get cached data or fetch new data
  async getCachedOrFetch(key, fetchFunction) {
    if (this.isCacheValid(key)) {
      console.log(`Using cached data for: ${key}`);
      return this.cache.get(key).data;
    }

    try {
      console.log(`Fetching fresh data for: ${key}`);
      const data = await fetchFunction();
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      });
      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      // Return cached data if available, even if expired
      const cached = this.cache.get(key);
      if (cached) {
        console.log(`Using expired cache for: ${key}`);
        return cached.data;
      }
      throw error;
    }
  }

  // Fetch all problems
  async getAllProblems(limit = 100) {
    const cacheKey = `problems_all_${limit}`;

    return this.getCachedOrFetch(cacheKey, async () => {
      // Try different endpoints
      const endpoints = [
        `${this.getCurrentApiBase()}/problems`,
        `${this.getCurrentApiBase()}/problemset/all`,
        `${this.getCurrentApiBase()}/api/problems`,
      ];

      for (const endpoint of endpoints) {
        try {
          const data = await this.fetchWithRetry(endpoint);
          const problems =
            data.stat_status_pairs || data.problems || data.data || data;

          if (Array.isArray(problems) && problems.length > 0) {
            return this.formatProblems(problems.slice(0, limit));
          }
        } catch (error) {
          console.warn(`Endpoint ${endpoint} failed:`, error.message);
          continue;
        }
      }

      // Fallback to mock data if all APIs fail
      return this.getMockProblems();
    });
  }

  // Search problems by query
  async searchProblems(query) {
    if (!query || query.trim().length < 2) {
      return this.getAllProblems();
    }

    const cacheKey = `search_${query.toLowerCase()}`;

    return this.getCachedOrFetch(cacheKey, async () => {
      try {
        // Since most APIs don't support search, we'll search locally
        const allProblems = await this.getAllProblems(200);
        return this.filterProblemsLocally(allProblems, query);
      } catch (error) {
        console.error("Search failed:", error);
        return this.getMockProblems().filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase())
            )
        );
      }
    });
  }

  // Get daily challenge
  async getDailyChallenge() {
    return this.getCachedOrFetch("daily_challenge", async () => {
      const endpoints = [
        `${this.getCurrentApiBase()}/daily`,
        `${this.getCurrentApiBase()}/dailyCodingChallengeV2`,
        `${this.getCurrentApiBase()}/api/daily`,
      ];

      for (const endpoint of endpoints) {
        try {
          const data = await this.fetchWithRetry(endpoint);
          if (data && (data.question || data.problem || data.data)) {
            const problem = data.question || data.problem || data.data || data;
            return this.formatProblem(problem);
          }
        } catch (error) {
          console.warn(
            `Daily challenge endpoint ${endpoint} failed:`,
            error.message
          );
          continue;
        }
      }

      // Fallback to random problem
      const problems = await this.getAllProblems(50);
      const randomIndex = Math.floor(Math.random() * problems.length);
      return problems[randomIndex];
    });
  }

  // Get random problem
  async getRandomProblem() {
    try {
      const problems = await this.getAllProblems(100);
      const randomIndex = Math.floor(Math.random() * problems.length);
      return problems[randomIndex];
    } catch (error) {
      console.error("Random problem failed:", error);
      const mockProblems = this.getMockProblems();
      const randomIndex = Math.floor(Math.random() * mockProblems.length);
      return mockProblems[randomIndex];
    }
  }

  // Filter problems by difficulty
  async getProblemsByDifficulty(difficulty) {
    if (difficulty === "All") {
      return this.getAllProblems();
    }

    const cacheKey = `difficulty_${difficulty.toLowerCase()}`;

    return this.getCachedOrFetch(cacheKey, async () => {
      const allProblems = await this.getAllProblems(200);
      return allProblems.filter(
        (p) => p.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    });
  }

  // Local search implementation
  filterProblemsLocally(problems, query) {
    const searchTerm = query.toLowerCase();
    return problems.filter(
      (problem) =>
        problem.title.toLowerCase().includes(searchTerm) ||
        problem.description.toLowerCase().includes(searchTerm) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Format single problem
  formatProblem(problem) {
    if (!problem) return null;

    // Handle different API response formats
    const stat = problem.stat || problem;
    const difficulty =
      problem.difficulty || this.getDifficultyFromLevel(stat.level || 2);

    return {
      id:
        stat.question_id ||
        stat.frontend_question_id ||
        stat.id ||
        Math.random(),
      title: stat.question__title || stat.title || "Untitled Problem",
      difficulty: difficulty,
      tags: this.extractTags(problem),
      description: this.extractDescription(problem),
      bookmarked: false,
      solved: false,
      solution: "",
      comments: Math.floor(Math.random() * 100) + 1,
      likes: Math.floor(Math.random() * 500) + 1,
      slug: stat.question__title_slug || stat.titleSlug || "",
      isPaidOnly: stat.paid_only || false,
      acceptance:
        stat.total_acs && stat.total_submitted
          ? ((stat.total_acs / stat.total_submitted) * 100).toFixed(1)
          : "0",
    };
  }

  // Format multiple problems
  formatProblems(problems) {
    if (!Array.isArray(problems)) return [];
    return problems
      .map((problem) => this.formatProblem(problem))
      .filter(Boolean);
  }

  // Extract tags from problem
  extractTags(problem) {
    if (problem.topicTags && Array.isArray(problem.topicTags)) {
      return problem.topicTags.map((tag) => tag.name || tag);
    }
    if (problem.tags && Array.isArray(problem.tags)) {
      return problem.tags;
    }

    // Generate tags based on difficulty
    const baseTags = ["Algorithm"];
    const difficulty =
      problem.difficulty ||
      this.getDifficultyFromLevel(problem.stat?.level || 2);

    switch (difficulty) {
      case "Easy":
        return [...baseTags, "Array", "String"];
      case "Medium":
        return [...baseTags, "Dynamic Programming", "Tree"];
      case "Hard":
        return [...baseTags, "Graph", "Backtracking"];
      default:
        return baseTags;
    }
  }

  // Extract description
  extractDescription(problem) {
    if (problem.content) {
      return (
        problem.content
          .replace(/<[^>]*>/g, "")
          .trim()
          .substring(0, 200) + "..."
      );
    }
    if (problem.description) {
      return problem.description;
    }

    // Generate description based on title
    const title = problem.stat?.question__title || problem.title || "Problem";
    return `Solve the ${title} problem. This is a coding challenge that tests your algorithmic thinking and programming skills.`;
  }

  // Get difficulty from level number
  getDifficultyFromLevel(level) {
    if (level === 1) return "Easy";
    if (level === 2) return "Medium";
    if (level === 3) return "Hard";
    return "Medium"; // default
  }

  // Get problem statistics
  async getProblemStats() {
    return this.getCachedOrFetch("stats", async () => {
      try {
        const problems = await this.getAllProblems(500);
        const stats = {
          total: problems.length,
          easy: problems.filter((p) => p.difficulty === "Easy").length,
          medium: problems.filter((p) => p.difficulty === "Medium").length,
          hard: problems.filter((p) => p.difficulty === "Hard").length,
          tags: [...new Set(problems.flatMap((p) => p.tags))],
        };
        return stats;
      } catch (error) {
        // Return mock stats
        return {
          total: 2500,
          easy: 800,
          medium: 1200,
          hard: 500,
          tags: ["Array", "String", "Dynamic Programming", "Tree", "Graph"],
        };
      }
    });
  }

  // Mock problems fallback
  getMockProblems() {
    return [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 15420,
        likes: 8932,
        slug: "two-sum",
        isPaidOnly: false,
        acceptance: "49.1",
      },
      {
        id: 2,
        title: "Add Two Numbers",
        difficulty: "Medium",
        tags: ["Linked List", "Math"],
        description:
          "You are given two non-empty linked lists representing two non-negative integers.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 8234,
        likes: 6543,
        slug: "add-two-numbers",
        isPaidOnly: false,
        acceptance: "35.2",
      },
      {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Sliding Window"],
        description:
          "Given a string s, find the length of the longest substring without repeating characters.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 7821,
        likes: 5432,
        slug: "longest-substring-without-repeating-characters",
        isPaidOnly: false,
        acceptance: "33.8",
      },
      {
        id: 4,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        description:
          "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 5432,
        likes: 3210,
        slug: "median-of-two-sorted-arrays",
        isPaidOnly: false,
        acceptance: "35.1",
      },
      {
        id: 5,
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        tags: ["String", "Dynamic Programming"],
        description:
          "Given a string s, return the longest palindromic substring in s.",
        bookmarked: false,
        solved: false,
        solution: "",
        comments: 6789,
        likes: 4321,
        slug: "longest-palindromic-substring",
        isPaidOnly: false,
        acceptance: "32.4",
      },
    ];
  }
}

// Export singleton instance
export const leetcodeService = new LeetCodeService();
export default leetcodeService;
