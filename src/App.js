import React, { useState } from "react";
import Navigation from "./components/Layout/Navigation";
import Dashboard from "./components/Dashboard/Dashboard";
import Problems from "./components/Problems/Problems";
import CodeEditor from "./components/Problems/CodeEditor";
import Rooms from "./components/Rooms/Rooms";
import Profile from "./components/Profile/Profile";
import { rooms } from "./data/mockData";
import { useProblemData } from "./hooks/useProblemData";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [bookmarkedProblems, setBookmarkedProblems] = useState(new Set());

  // Use problem data hook
  const {
    problems,
    loading,
    error,
    stats,
    searchProblems,
    filterByDifficulty,
    getDailyChallenge,
    getRandomProblem,
    loadProblems,
  } = useProblemData();

  // Handle problem selection
  const handleSelectProblem = (problem) => {
    console.log("Selected problem:", problem);
    setSelectedProblem(problem);
    setActiveTab("codeEditor");
  };

  // Handle back to problems list
  const handleBackToProblems = () => {
    setSelectedProblem(null);
    setActiveTab("problems");
  };

  // Handle bookmark toggle
  const handleToggleBookmark = (problemId) => {
    setBookmarkedProblems((prev) => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(problemId)) {
        newBookmarks.delete(problemId);
        console.log(`Problem ${problemId} removed from bookmarks`);
      } else {
        newBookmarks.add(problemId);
        console.log(`Problem ${problemId} added to bookmarks`);
      }
      return newBookmarks;
    });

    // Update selected problem if it's currently being viewed
    if (selectedProblem && selectedProblem.id === problemId) {
      setSelectedProblem((prev) => ({
        ...prev,
        bookmarked: !prev.bookmarked,
      }));
    }
  };

  // Add bookmark status to problems
  const problemsWithBookmarks = problems.map((problem) => ({
    ...problem,
    bookmarked: bookmarkedProblems.has(problem.id),
  }));

  // Get bookmarked problems for profile
  const getBookmarkedProblems = () => {
    return problemsWithBookmarks.filter((problem) => problem.bookmarked);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            stats={stats}
            getDailyChallenge={getDailyChallenge}
            getRandomProblem={getRandomProblem}
            onSelectProblem={handleSelectProblem}
            loading={loading}
            error={error}
          />
        );
      case "problems":
        return (
          <Problems
            problems={problemsWithBookmarks}
            loading={loading}
            error={error}
            onSelectProblem={handleSelectProblem}
            onToggleBookmark={handleToggleBookmark}
            onSearch={searchProblems}
            onFilterDifficulty={filterByDifficulty}
            onRefresh={loadProblems}
          />
        );
      case "codeEditor":
        return (
          <CodeEditor
            problem={selectedProblem}
            onBack={handleBackToProblems}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      case "rooms":
        return <Rooms rooms={rooms} />;
      case "profile":
        return (
          <Profile
            problems={problemsWithBookmarks}
            bookmarkedProblems={getBookmarkedProblems()}
          />
        );
      default:
        return (
          <Dashboard
            stats={stats}
            getDailyChallenge={getDailyChallenge}
            getRandomProblem={getRandomProblem}
            onSelectProblem={handleSelectProblem}
            loading={loading}
            error={error}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fade-in">{renderContent()}</div>
      </main>
    </div>
  );
}

export default App;
