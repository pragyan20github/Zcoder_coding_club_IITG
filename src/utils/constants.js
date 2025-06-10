export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const AUTH_CONFIG = {
  TOKEN_KEY: "zcoder_auth_token",
  REFRESH_TOKEN_KEY: "zcoder_refresh_token",
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000,
};

export const DIFFICULTY_LEVELS = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

export const DIFFICULTY_COLORS = {
  [DIFFICULTY_LEVELS.EASY]: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  [DIFFICULTY_LEVELS.MEDIUM]: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  [DIFFICULTY_LEVELS.HARD]: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
};

export const PROGRAMMING_LANGUAGES = {
  JAVASCRIPT: "javascript",
  PYTHON: "python",
  JAVA: "java",
  CPP: "cpp",
  C: "c",
  GO: "go",
  RUST: "rust",
};

export const LANGUAGE_CONFIG = {
  [PROGRAMMING_LANGUAGES.JAVASCRIPT]: {
    name: "JavaScript",
    extension: "js",
    aceMode: "javascript",
    defaultCode:
      "// Write your JavaScript solution here\nfunction solution() {\n    \n}",
  },
  [PROGRAMMING_LANGUAGES.PYTHON]: {
    name: "Python",
    extension: "py",
    aceMode: "python",
    defaultCode: "# Write your Python solution here\ndef solution():\n    pass",
  },
  [PROGRAMMING_LANGUAGES.JAVA]: {
    name: "Java",
    extension: "java",
    aceMode: "java",
    defaultCode:
      "// Write your Java solution here\npublic class Solution {\n    public void solution() {\n        \n    }\n}",
  },
};

export const EDITOR_THEMES = {
  MONOKAI: "monokai",
  GITHUB: "github",
  TOMORROW: "tomorrow",
  TWILIGHT: "twilight",
  SOLARIZED_DARK: "solarized_dark",
  SOLARIZED_LIGHT: "solarized_light",
};

export const NAV_TABS = {
  DASHBOARD: "dashboard",
  PROBLEMS: "problems",
  CODE_EDITOR: "codeEditor",
  ROOMS: "rooms",
  PROFILE: "profile",
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: "zcoder_user_preferences",
  EDITOR_SETTINGS: "zcoder_editor_settings",
  BOOKMARKED_PROBLEMS: "zcoder_bookmarked_problems",
  RECENT_SOLUTIONS: "zcoder_recent_solutions",
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Internal server error. Please try again later.",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in!",
  LOGOUT_SUCCESS: "Successfully logged out!",
  PROFILE_UPDATED: "Profile updated successfully!",
  PROBLEM_SOLVED: "Congratulations! Problem solved!",
  ROOM_JOINED: "Successfully joined the room!",
};
