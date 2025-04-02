import { ColumnFiltersState } from "@tanstack/react-table";
import { useState } from "react";

interface FilterModalProps {
  onClose: () => void;
  onApplyFilters: (val: ColumnFiltersState) => void;
}

export const FilterModal = ({ onClose, onApplyFilters }: FilterModalProps) => {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [flavorFilter, setFlavorFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const handleApply = () => {
    const filters: ColumnFiltersState = [];
    if (typeFilter) {
      filters.push({ id: "type", value: typeFilter })
    }
    if (flavorFilter) {
      filters.push({ id: "flavor", value: flavorFilter });
    }
    if (statusFilter) {
      filters.push({ id: "status", value: statusFilter });
    }
    onApplyFilters(filters);
    onClose();
  };

  return (
    <div className="w-64 bg-zinc-800 border border-zinc-200/20 rounded-lg p-4 shadow-lg z-10">
      <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>

      <div className="mb-4">
        <label className="block text-sm text-zinc-200 mb-1">Tipo</label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full bg-zinc-700/50 text-zinc-200 border border-zinc-500/60 rounded-md p-2 outline-none focus:border-cyan-600"
        >
          <option value="">Todos</option>
          <option value="Sorvete">Sorvete</option>
          <option value="Bebida">Bebida</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-zinc-200 mb-1">Sabor</label>
        <select
          value={flavorFilter}
          onChange={(e) => setFlavorFilter(e.target.value)}
          className="w-full bg-zinc-700/50 text-zinc-200 border border-zinc-500/60 rounded-md p-2 outline-none focus:border-cyan-600"
        >
          <option value="">Todos</option>
          <option value="Chocolate">Chocolate</option>
          <option value="Baunilha">Baunilha</option>
          <option value="Cola">Cola</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-zinc-200 mb-1">Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-zinc-700/50 text-zinc-200 border border-zinc-500/60 rounded-md p-2 outline-none focus:border-cyan-600"
        >
          <option value="">Todos</option>
          <option value="Bastante">Bastante</option>
          <option value="Suficiente">Suficiente</option>
          <option value="Pouco">Pouco</option>
          <option value="Zerado">Zerado</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-500"
        >
          Cancelar
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};