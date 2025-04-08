import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils";

interface FilterOptions {
  types: string[];
  flavors: string[];
  statuses: string[];
}

export const useItemFilters = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    types: [],
    flavors: [],
    statuses: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilterOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/items/filters`);
      setFilterOptions(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar opções de filtro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return { filterOptions, loading, error };
};