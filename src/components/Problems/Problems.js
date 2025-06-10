import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Bookmark,
  Check,
  MessageCircle,
  Star,
  Loader,
  RefreshCw,
  Zap,
  AlertCircle,
} from "lucide-react";

const Problems = ({
  problems,
  loading,
  error,
  onSelectProblem,
  onToggleBookmark,
  onSearch,
  onFilterDifficulty,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState("title");

  // Debounced search function - FIXED
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      console.log("Debounced search triggered for:", term);
      setSearchLoading(true);
      try {
        await onSearch(term);
        console.log("Search completed successfully");
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 300), // Reduced debounce time for faster response
    [onSearch]
  );

  // Handle search input changes - FIXED
  useEffect(() => {
    console.log("Search term changed to:", searchTerm);
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Handle difficulty filter changes
  const handleDifficultyChange = async (difficulty) => {
    console.log("Difficulty filter changed to:", difficulty);
    setSelectedDifficulty(difficulty);
    setSearchLoading(true);
    try {
      await onFilterDifficulty(difficulty);
    } catch (error) {
      console.error("Filter error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    console.log("Refreshing problems...");
    setSearchLoading(true);
    setSearchTerm(""); // Clear search on refresh
    try {
      await onRefresh();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Sort problems
  const sortProblems = (problems) => {
    return [...problems].sort((a, b) => {
      switch (sortBy) {
        case "difficulty":
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "likes":
          return b.likes - a.likes;
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });
  };

  // Filter problems locally for bookmarks and sorting
  const filteredProblems = sortProblems(
    problems.filter((problem) => {
      const matchesBookmark = !filterBookmarked || problem.bookmarked;
      return matchesBookmark;
    })
  );

  const bookmarkedCount = problems.filter((p) => p.bookmarked).length;
  const solvedCount = problems.filter((p) => p.solved).length;

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-400 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Failed to load problems
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-semibold flex items-center space-x-2">
              <Zap className="w-6 h-6 text-blue-600" />
              <span>Coding Problems</span>
            </h2>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>{problems.length} total problems</span>
              <span>•</span>
              <span>{bookmarkedCount} bookmarked</span>
              <span>•</span>
              <span>{solvedCount} solved</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setFilterBookmarked(!filterBookmarked)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                filterBookmarked
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  : "bg-gray-100 text-gray-600 hover:bg-yellow-50"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{filterBookmarked ? "Show All" : "Bookmarked"}</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading || searchLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading || searchLoading ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            {searchLoading && (
              <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin" />
            )}
            <input
              type="text"
              placeholder="Search problems by title, tags, or description..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                console.log("Search input changed:", e.target.value);
                setSearchTerm(e.target.value);
              }}
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDifficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="likes">Sort by Popularity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm">
            {searchLoading ? (
              <span className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Searching for "{searchTerm}"...</span>
              </span>
            ) : (
              `Found ${filteredProblems.length} problems matching "${searchTerm}"`
            )}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <Loader className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
          <p className="text-gray-600">Loading coding problems...</p>
        </div>
      )}

      {/* Problems List */}
      {!loading && (
        <div className="space-y-4">
          {filteredProblems.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No problems found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? `No problems match "${searchTerm}". Try a different search term.`
                  : filterBookmarked
                  ? "You haven't bookmarked any problems yet."
                  : "No problems available."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 hover:border-blue-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {problem.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
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
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            ✓ Solved
                          </span>
                        )}
                        {problem.bookmarked && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            ★ Bookmarked
                          </span>
                        )}
                        {problem.isPaidOnly && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                            Premium
                          </span>
                        )}
                        {problem.acceptance && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {problem.acceptance} acceptance
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {problem.description}
                      </p>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{problem.comments} discussions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{problem.likes} likes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {problem.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 3 && (
                            <span className="text-xs text-gray-400 font-medium">
                              +{problem.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      <button
                        onClick={() => onToggleBookmark(problem.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          problem.bookmarked
                            ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600"
                        }`}
                        title={
                          problem.bookmarked
                            ? "Remove bookmark"
                            : "Add bookmark"
                        }
                      >
                        {problem.bookmarked ? (
                          <div className="flex items-center relative">
                            <Bookmark className="w-4 h-4 fill-current" />
                            <Check className="w-2 h-2 absolute ml-1 mt-1" />
                          </div>
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        onClick={() => onSelectProblem(problem)}
                      >
                        Solve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default Problems;
