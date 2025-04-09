import { useState, useEffect } from 'react';
import { API_URL } from '../utils';

export interface Item {
  id: string;
  name: string;
  type?: string;
  qtd?: number;
  value?: number;
  flavor?: string;
  status?: string;

}

interface UseItemsResponse {
  items: Item[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useItems = (): UseItemsResponse => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar itens');
      }

      const data: Item[] = await response.json();
      setItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  };
};