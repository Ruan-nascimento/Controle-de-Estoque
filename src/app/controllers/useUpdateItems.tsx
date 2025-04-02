import { useState } from "react";
import { Item } from "@/app/controllers/getAllItems";
import { API_URL } from "@/lib/utils";

export function useUpdateItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateItem = async (id: string, updatedFields: Partial<Item>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar item");
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateItem, loading, error };
}