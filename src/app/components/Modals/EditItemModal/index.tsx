"use client";

import { useState, useEffect } from "react";
import { TextInput } from "../../Inputs/textInputs";
import { GeneralButton } from "../../ButtonGeneral";
import { Item } from "@/app/controllers/getAllItems";
import { toast } from "sonner";
import { useUpdateItem } from "@/app/controllers/useUpdateItems";

interface EditItemModalProps {
  setOpenEditModal: (val: boolean) => void;
  selectedItem: Item | null;
  onUpdate?: () => void;
}

export const EditItemModal = ({ setOpenEditModal, selectedItem, onUpdate }: EditItemModalProps) => {
  const [title, setTitle] = useState<string>(selectedItem?.name || "");
  const [type, setType] = useState<string>(selectedItem?.type || "");
  const [flavor, setFlavor] = useState<string>(selectedItem?.flavor || "");
  const [quantity, setQuantity] = useState<number>(selectedItem?.qtd || 0);
  const [value, setValue] = useState<number>(selectedItem?.value || 0);

  const { updateItem, loading: updateLoading, error: updateError } = useUpdateItem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      toast.error("Nenhum item selecionado!");
      return;
    }

    const updatedFields: Partial<Item> = {};

    // Transforma os campos de texto em minúsculas antes de comparar e enviar
    const titleLower = title.toLowerCase();
    const typeLower = type.toLowerCase();
    const flavorLower = flavor.toLowerCase();

    if (titleLower !== selectedItem.name) {
      updatedFields.name = titleLower;
    }
    if (typeLower !== selectedItem.type) {
      updatedFields.type = typeLower;
    }
    if (flavorLower !== selectedItem.flavor) {
      updatedFields.flavor = flavorLower;
    }
    if (quantity !== selectedItem.qtd) {
      updatedFields.qtd = quantity;
    }
    if (value !== selectedItem.value) {
      updatedFields.value = value;
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info("Nenhuma alteração detectada.");
      setOpenEditModal(false);
      return;
    }

    try {
      await updateItem(selectedItem.id, updatedFields);
      toast.success("Item atualizado com sucesso!");
      setOpenEditModal(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro desconhecido");
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenEditModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setOpenEditModal]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-zinc-800 shadow-md rounded-lg p-6 border border-zinc-700 flex flex-col gap-5 overflow-y-auto max-h-[90vh]"
      >
        <h1 className="text-xl font-semibold text-zinc-200">
          {title ? title.toUpperCase() : "Item"}
        </h1>

        <div className="flex flex-col gap-4">
          <TextInput
            label="Nome do Item"
            valueInput={title}
            placeholder="Mude o Título..."
            func={setTitle}
            disabled={updateLoading}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
            <TextInput
              label="Tipo do Item"
              valueInput={type}
              placeholder="Mude o Tipo..."
              func={setType}
              className="flex-1"
              disabled={updateLoading}
            />
            <TextInput
              label="Sabor do Item"
              valueInput={flavor}
              placeholder="Mude o Sabor..."
              func={setFlavor}
              className="flex-1"
              disabled={updateLoading}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
            <TextInput
              label="Quantidade"
              valueInput={quantity.toString()}
              placeholder="Mude a Quantidade..."
              func={(val: any) => setQuantity(val ? parseInt(val) : 0)}
              className="flex-1"
              disabled={updateLoading}
            />

            <TextInput
              label="Preço do Item"
              valueInput={value.toFixed(2)}
              placeholder="Mude o Valor..."
              func={(val: any) => setValue(val ? parseFloat(val) : 0)}
              className="flex-1"
              disabled={updateLoading}
            />
          </div>
        </div>

        <GeneralButton
          type="submit"
          className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
          disabled={updateLoading}
        >
          {updateLoading ? "Atualizando..." : "Atualizar"}
        </GeneralButton>

        <span
          onClick={() => setOpenEditModal(false)}
          className="absolute top-3 right-3 cursor-pointer border border-transparent p-2 rounded bg-zinc-900 w-8 h-8 flex items-center justify-center text-zinc-200 hover:border-zinc-200 transition-all"
        >
          X
        </span>
      </form>
    </div>
  );
};