"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { Item } from "@/app/controllers/getAllItems";
import { ColumnFiltersState } from "@tanstack/react-table";
import { API_URL } from "../utils";

interface AppContextType {
  items: Item[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  openAddModal: boolean;
  setOpenAddModal: (val: boolean) => void;
  openEditModal: boolean;
  setOpenEditModal: (val: boolean, item?: Item) => void;
  selectedEditItem: Item | null;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModalState] = useState(false);
  const [selectedEditItem, setSelectedEditItem] = useState<Item | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setItems(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar itens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const refetch = async () => {
    await fetchItems();
  };

  const setOpenEditModal = (val: boolean, item?: Item) => {
    setOpenEditModalState(val);
    setSelectedEditItem(val ? item || null : null);
  };

  return (
    <AppContext.Provider
      value={{
        items,
        loading,
        error,
        refetch: fetchItems,
        openAddModal,
        setOpenAddModal,
        openEditModal,
        setOpenEditModal,
        selectedEditItem,
        columnFilters,
        setColumnFilters,
        searchTerm,
        setSearchTerm,
        selectedIds,
        setSelectedIds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext deve ser usado dentro de um AppProvider");
  }
  return context;
};