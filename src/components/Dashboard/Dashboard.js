import React, { useState, useEffect } from "react";
import {
  Code,
  Star,
  Users,
  Zap,
  Calendar,
  Shuffle,
  TrendingUp,
  Clock,
  Target,
  Award,
  Loader,
  RefreshCw,
} from "lucide-react";
import { currentUser, recentActivities } from "../../data/mockData";

const Dashboard = ({
  stats,
  getDailyChallenge,
  getRandomProblem,
  onSelectProblem,
  loading,
  error,
}) => {
  const [dailyProblem, setDailyProblem] = useState(null);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [dailyError, setDailyError] = useState(null);

  // Load daily challenge on component mount
  useEffect(() => {
    loadDailyChallenge();
  }, []);

  const loadDailyChallenge = async () => {
    setLoadingDaily(true);
    setDailyError(null);
    try {
      console.log("Loading daily challenge...");
      const problem = await getDailyChallenge();
      console.log("Daily challenge loaded:", problem);
      setDailyProblem(problem);
    } catch (error) {
      console.error("Failed to load daily challenge:", error);
      setDailyError("Failed to load daily challenge");
    } finally {
      setLoadingDaily(false);
    }
  };

  const handleRandomProblem = async () => {
    setLoadingRandom(true);
    try {
      console.log("Getting random problem...");
      const problem = await getRandomProblem();
      console.log("Random problem:", problem);
      if (problem) {
        onSelectProblem(problem);
      }
    } catch (error) {
      console.error("Failed to get random problem:", error);
    } finally {
      setLoadingRandom(false);
    }
  };

  const handleDailyChallenge = () => {
    if (dailyProblem) {
      onSelectProblem(dailyProblem);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {currentUser.name}! 🚀
            </h1>
            <p className="opacity-90">
              Continue your coding journey with challenging problems
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-sm opacity-75">Current Level</div>
              <div className="text-xl font-bold">{currentUser.level}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Problems Solved</p>
              <p className="text-2xl font-bold text-green-600">
                {currentUser.solvedProblems}
              </p>
            </div>
            <Code className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">
                {currentUser.streak} days
              </p>
            </div>
            <Star className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contributions</p>
              <p className="text-2xl font-bold text-blue-600">
                {currentUser.contributions}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Problems</p>
              <p className="text-2xl font-bold text-purple-600">
                {loading ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  stats?.total || "2500+"
                )}
              </p>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Challenge */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Daily Challenge</span>
              </h2>
              <button
                onClick={loadDailyChallenge}
                disabled={loadingDaily}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loadingDaily ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {loadingDaily ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ) : dailyError ? (
              <div className="text-center py-4">
                <p className="text-red-500 text-sm mb-2">{dailyError}</p>
                <button
                  onClick={loadDailyChallenge}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : dailyProblem ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {dailyProblem.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        dailyProblem.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : dailyProblem.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {dailyProblem.difficulty}
                    </span>
                    {dailyProblem.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {dailyProblem.description.substring(0, 120)}...
                  </p>
                </div>
                <button
                  onClick={handleDailyChallenge}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Target className="w-4 h-4" />
                  <span>Solve Daily Challenge</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No daily challenge available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span>Quick Actions</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleRandomProblem}
                disabled={loadingRandom}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loadingRandom ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Shuffle className="w-4 h-4" />
                )}
                <span>{loadingRandom ? "Loading..." : "Random Problem"}</span>
              </button>

              <button
                onClick={() => {
                  /* Navigate to problems */
                }}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Browse Problems</span>
              </button>
            </div>
          </div>

          {/* Problem Statistics */}
          {stats && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-green-600" />
                <span>Problem Statistics</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">
                    {stats.total}
                  </div>
                  <div className="text-sm text-blue-600">Total</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">
                    {stats.easy}
                  </div>
                  <div className="text-sm text-green-600">Easy</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-800">
                    {stats.medium}
                  </div>
                  <div className="text-sm text-yellow-600">Medium</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-800">
                    {stats.hard}
                  </div>
                  <div className="text-sm text-red-600">Hard</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span>Recent Activity</span>
        </h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-2 h-2 bg-${activity.color}-500 rounded-full`}
              ></div>
              <span className="text-sm flex-1">{activity.message}</span>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-red-400">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Connection Error
              </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
