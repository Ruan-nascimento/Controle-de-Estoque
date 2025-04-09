"use client";

import { API_URL } from "@/lib/utils";
import { useState, useEffect } from "react";

interface Item {
  id: string;
  name: string;
  flavor: string;
  value: number;
  qtd: number;
  status: string;
  type: string;
  createdAt: string;
}

interface UseItemsReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
  refetchItems: () => Promise<void>;
}

export const useItems = (): UseItemsReturn => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar os itens");
      }

      const data = await response.json();
      setItems(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, loading, error, refetchItems: fetchItems };
};