import { useEffect, useRef, useState } from "react";

import { locationApi } from "../api/locationApi";

export function useLocationSearch(query, delay = 500) {
  const cacheRef = useRef(new Map());
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      setError("");
      return undefined;
    }

    const cached = cacheRef.current.get(normalizedQuery.toLowerCase());
    if (cached) {
      setSuggestions(cached);
      setIsSearching(false);
      setError("");
      return undefined;
    }

    let isCurrent = true;
    setIsSearching(true);
    const timer = window.setTimeout(async () => {
      setError("");

      try {
        const response = await locationApi.search(normalizedQuery);
        const locations = response.data.locations;
        cacheRef.current.set(normalizedQuery.toLowerCase(), locations);
        if (isCurrent) setSuggestions(locations);
      } catch (requestError) {
        if (isCurrent) {
          setSuggestions([]);
          setError(requestError.message);
        }
      } finally {
        if (isCurrent) setIsSearching(false);
      }
    }, delay);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [delay, query]);

  return { suggestions, isSearching, error, clearSuggestions: () => setSuggestions([]) };
}
