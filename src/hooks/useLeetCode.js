// src/hooks/useLeetCode.js
import { useState, useEffect, useCallback } from "react";
import leetcodeService from "../services/leetcodeApi";

export const useLeetCode = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Load initial problems
  const loadProblems = useCallback(async (limit = 50, skip = 0) => {
    setLoading(true);
    setError(null);

    try {
      const data = await leetcodeService.getAllProblems(limit, skip);
      setProblems(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error loading problems:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search problems
  const searchProblems = useCallback(
    async (query) => {
      if (!query || query.trim().length < 2) {
        return loadProblems();
      }

      setLoading(true);
      setError(null);

      try {
        const data = await leetcodeService.searchProblems(query);
        setProblems(data || []);
      } catch (err) {
        setError(err.message);
        console.error("Error searching problems:", err);
      } finally {
        setLoading(false);
      }
    },
    [loadProblems]
  );

  // Filter by difficulty
  const filterByDifficulty = useCallback(
    async (difficulty) => {
      if (difficulty === "All") {
        return loadProblems();
      }

      setLoading(true);
      setError(null);

      try {
        const data = await leetcodeService.getProblemsByDifficulty(difficulty);
        setProblems(data || []);
      } catch (err) {
        setError(err.message);
        console.error("Error filtering by difficulty:", err);
      } finally {
        setLoading(false);
      }
    },
    [loadProblems]
  );

  // Get daily challenge
  const getDailyChallenge = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await leetcodeService.getDailyChallenge();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error getting daily challenge:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get random problem
  const getRandomProblem = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await leetcodeService.getRandomProblem();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error getting random problem:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const data = await leetcodeService.getProblemStats();
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadProblems();
    loadStats();
  }, [loadProblems, loadStats]);

  return {
    problems,
    loading,
    error,
    stats,
    loadProblems,
    searchProblems,
    filterByDifficulty,
    getDailyChallenge,
    getRandomProblem,
    loadStats,
  };
};

export default useLeetCode;
