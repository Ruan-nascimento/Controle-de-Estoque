import { API_URL } from "@/lib/utils";
import { useState, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  flavor: string;
  value: number;
  quantity: number;
  [key: string]: any;
}

interface UseCartResponse {
  cartItems: CartItem[];
  addToCart: (item: any) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>; // Nova função
  loading: boolean;
  error: string | null;
}

export const useCart = (): UseCartResponse => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar o carrinho");
      }

      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: any) => {
    try {
      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        await updateQuantity(item.id, newQuantity);
        return;
      }

      const newItem = { ...item, quantity: 1 };
      setCartItems((prevItems) => [...prevItems, newItem]);

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        setCartItems((prevItems) =>
          prevItems.filter((cartItem) => cartItem.id !== item.id)
        );
        throw new Error("Erro ao adicionar item ao carrinho");
      }

      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, quantity }),
      });

      if (!response.ok) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity } : item
          )
        );
        throw new Error("Erro ao atualizar a quantidade");
      }

      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      // Atualização otimista: remove o item do estado local imediatamente
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        // Se a requisição falhar, reverte a mudança (adiciona o item de volta)
        const itemToRestore = cartItems.find((item) => item.id === id);
        if (itemToRestore) {
          setCartItems((prevItems) => [...prevItems, itemToRestore]);
        }
        throw new Error("Erro ao remover item do carrinho");
      }

      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    loading,
    error,
  };
};