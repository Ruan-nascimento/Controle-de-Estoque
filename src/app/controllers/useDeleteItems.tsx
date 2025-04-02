import { useState } from "react";
import { API_URL } from "@/lib/utils";

export function useDeleteItems() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItems = async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar itens");
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItems, loading, error };
}