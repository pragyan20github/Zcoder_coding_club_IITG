import React, { useState } from "react";
import { Edit, Bookmark } from "lucide-react";
import { currentUser, achievements, skills } from "../../data/mockData";

const Profile = ({ problems }) => {
  const [activeSection, setActiveSection] = useState("solutions");

  const solvedProblems = problems.filter((p) => p.solved);
  const bookmarkedProblems = problems.filter((p) => p.bookmarked);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <p className="text-gray-600">@{currentUser.username}</p>
            <p className="text-sm text-gray-700 mt-2">{currentUser.bio}</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {currentUser.level}
              </span>
              <span className="text-sm text-gray-600">
                Member since Jan 2024
              </span>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 bg-${achievement.color}-100 rounded-full flex items-center justify-center`}
                >
                  {achievement.icon}
                </div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveSection("solutions")}
              className={`py-4 border-b-2 font-medium text-sm ${
                activeSection === "solutions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Recent Solutions ({solvedProblems.length})
            </button>
            <button
              onClick={() => setActiveSection("bookmarks")}
              className={`py-4 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                activeSection === "bookmarks"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks ({bookmarkedProblems.length})</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeSection === "solutions" && (
            <div className="space-y-3">
              {solvedProblems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No solved problems yet.</p>
                </div>
              ) : (
                solvedProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{problem.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
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
                        <span className="text-sm text-gray-600">
                          {problem.likes} likes • {problem.comments} comments
                        </span>
                        {problem.bookmarked && (
                          <span className="text-yellow-600">
                            <Bookmark className="w-3 h-3 fill-current" />
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      View Solution
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeSection === "bookmarks" && (
            <div className="space-y-3">
              {bookmarkedProblems.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No bookmarked problems yet.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Bookmark problems to save them for later!
                  </p>
                </div>
              ) : (
                bookmarkedProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded"
                  >
                    <div>
                      <p className="font-medium">{problem.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
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
                        <span className="text-sm text-gray-600">
                          {problem.likes} likes • {problem.comments} comments
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bookmark className="w-4 h-4 text-yellow-600 fill-current" />
                      <button className="text-blue-600 hover:text-blue-800">
                        {problem.solved ? "View Solution" : "Solve"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
