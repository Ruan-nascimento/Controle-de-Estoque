"use client";

import { API_URL } from "@/lib/utils";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useContext } from "react";

interface CartItem {
  id: string;
  name: string;
  flavor: string;
  value: number;
  quantity: number;
  qtd: number;
  [key: string]: any;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: any) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  confirmSale: () => Promise<void>;
  refetch: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
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
        if (newQuantity > existingItem.qtd) {
          throw new Error(
            `Não é possível adicionar mais unidades de ${existingItem.name}. Estoque máximo atingido (${existingItem.qtd} unidades).`
          );
        }
        await updateQuantity(item.id, newQuantity);
        return;
      }

      if (item.qtd < 1) {
        throw new Error(
          `Não é possível adicionar ${item.name}. Estoque insuficiente (${item.qtd} unidades).`
        );
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
      const item = cartItems.find((cartItem) => cartItem.id === id);
      if (!item) {
        throw new Error("Item não encontrado no carrinho");
      }

      if (quantity > item.qtd) {
        throw new Error(
          `Não é possível aumentar a quantidade de ${item.name}. Estoque máximo atingido (${item.qtd} unidades).`
        );
      }

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

  const clearCart = async () => {
    try {
      setCartItems([]);

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: [] }),
      });

      if (!response.ok) {
        throw new Error("Erro ao esvaziar o carrinho");
      }

      const data = await response.json();
      setCartItems(data.cart || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    }
  };

  const confirmSale = async () => {
    setLoading(true)
    try {
      if (cartItems.length === 0) {
        throw new Error("O carrinho está vazio. Adicione itens antes de confirmar a venda.");
      }

      const response = await fetch(`${API_URL}/api/sale`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao confirmar a venda");
      }

      setCartItems([]);
      await refetch();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao confirmar a venda";
      setError(errorMessage);
      throw err;
    } finally {
        setLoading(false)
    }
  };

  const refetch = async () => {
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        confirmSale,
        refetch,
        loading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};