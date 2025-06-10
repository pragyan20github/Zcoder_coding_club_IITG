// src/hooks/useProblemData.js
import { useState, useEffect, useCallback } from "react";
import problemService from "../services/problemApi";

export const useProblemData = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Load initial problems
  const loadProblems = useCallback(async (limit = 50) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Loading problems...");
      const data = await problemService.getAllProblems(limit);
      console.log("Problems loaded:", data.length);
      setProblems(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error loading problems:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search problems by keyword - FIXED
  const searchProblems = useCallback(async (keyword) => {
    console.log("Search function called with keyword:", keyword);

    setLoading(true);
    setError(null);

    try {
      const data = await problemService.searchProblems(keyword);
      console.log("Search completed, results:", data.length);
      setProblems(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error searching problems:", err);
      // Fallback to all problems on error
      const allProblems = await problemService.getAllProblems();
      setProblems(allProblems || []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter by difficulty
  const filterByDifficulty = useCallback(async (difficulty) => {
    console.log("Filtering by difficulty:", difficulty);

    setLoading(true);
    setError(null);

    try {
      const data = await problemService.getProblemsByDifficulty(difficulty);
      console.log("Filter completed, results:", data.length);
      setProblems(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error filtering by difficulty:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get daily challenge
  const getDailyChallenge = useCallback(async () => {
    try {
      console.log("Getting daily challenge...");
      const data = await problemService.getDailyChallenge();
      console.log("Daily challenge:", data?.title);
      return data;
    } catch (err) {
      console.error("Error getting daily challenge:", err);
      return null;
    }
  }, []);

  // Get random problem
  const getRandomProblem = useCallback(async () => {
    try {
      console.log("Getting random problem...");
      const data = await problemService.getRandomProblem();
      console.log("Random problem:", data?.title);
      return data;
    } catch (err) {
      console.error("Error getting random problem:", err);
      return null;
    }
  }, []);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      console.log("Loading stats...");
      const data = await problemService.getProblemStats();
      console.log("Stats loaded:", data);
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    console.log("Initializing problem data...");
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

export default useProblemData;
