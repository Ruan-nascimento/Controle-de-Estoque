"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useItemFilters } from "@/lib/hooks/useFilters";

interface FilterModalProps {
  onClose: () => void;
  onApplyFilters: (val: ColumnFiltersState) => void;
}

export const FilterModal = ({ onClose, onApplyFilters }: FilterModalProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { filterOptions, loading, error } = useItemFilters();

  const handleApply = () => {
    const filters: ColumnFiltersState = [];
    if (selectedType) {
      filters.push({ id: "type", value: selectedType });
    }
    if (selectedFlavor) {
      filters.push({ id: "flavor", value: selectedFlavor });
    }
    if (selectedStatus) {
      filters.push({ id: "status", value: selectedStatus });
    }
    onApplyFilters(filters);
    onClose();
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(selectedType === type ? null : type);
  };

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavor(selectedFlavor === flavor ? null : flavor);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  return (
    <div className="w-80 bg-zinc-900 border absolute -top-30 left-78 border-zinc-700 rounded-lg p-6 shadow-lg z-10 max-h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-6">Filtros</h3>

      {loading && (
        <div className="flex justify-center mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
        </div>
      )}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="mb-6">
        <h4 className="text-sm text-zinc-200 mb-2">Tipo</h4>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(90px,_1fr))] gap-2 max-h-[calc(10_*_1.75rem)] overflow-y-auto">
          {filterOptions.types.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedType === type}
                onCheckedChange={() => handleTypeChange(type)}
                className="border-zinc-600 data-[state=checked]:bg-cyan-600"
              />
              <label
                htmlFor={`type-${type}`}
                className="text-zinc-200 text-sm cursor-pointer"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm text-zinc-200 mb-2">Sabor</h4>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(90px,_1fr))] gap-2 max-h-[calc(10_*_1.75rem)] overflow-y-auto">
          {filterOptions.flavors.map((flavor) => (
            <div key={flavor} className="flex items-center gap-2">
              <Checkbox
                id={`flavor-${flavor}`}
                checked={selectedFlavor === flavor}
                onCheckedChange={() => handleFlavorChange(flavor)}
                className="border-zinc-600 data-[state=checked]:bg-cyan-600"
              />
              <label
                htmlFor={`flavor-${flavor}`}
                className="text-zinc-200 text-sm cursor-pointer"
              >
                {flavor}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm text-zinc-200 mb-2">Status</h4>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(90px,_1fr))] gap-2 max-h-[calc(10_*_1.75rem)] overflow-y-auto">
          {filterOptions.statuses.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <Checkbox
                id={`status-${status}`}
                checked={selectedStatus === status}
                onCheckedChange={() => handleStatusChange(status)}
                className="border-zinc-600 data-[state=checked]:bg-cyan-600"
              />
              <label
                htmlFor={`status-${status}`}
                className="text-zinc-200 text-sm cursor-pointer"
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="bg-zinc-700 text-white border-zinc-600 hover:bg-zinc-600"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleApply}
          className="bg-cyan-600 text-white hover:bg-cyan-500"
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
};