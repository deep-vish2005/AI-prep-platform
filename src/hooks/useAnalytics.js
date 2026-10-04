import { useEffect, useState } from "react";
import api from "../services/api";

function useAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await api.get("/analytics");
        setAnalytics(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load analytics.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  return {
    analytics,
    isLoading,
    error,
  };
}

export default useAnalytics;
