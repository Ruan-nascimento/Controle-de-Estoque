"use client";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemFormData, itemSchema } from "@/lib/schemas/itemSchema";
import { useAddItem } from "@/lib/hooks/useAddItem";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { useAppContext } from "@/lib/contexts/AppContext";
import { GeneralButton } from "../../ButtonGeneral";
import { Spinner } from "../../spinner";

interface AddNewItemModalProps {
  openAddModal: boolean;
  setOpenAddModal: (val: boolean) => void;
}

export const AddNewItemModal = ({ openAddModal, setOpenAddModal }: AddNewItemModalProps) => {
  const { addItem, loading, error, success } = useAddItem();
  const { refetch } = useAppContext();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      type: "",
      qtd: undefined,
      value: undefined,
      flavor: "",
    },
  });

  const name = watch("name") || "Nome do Item";
  const value = watch("value");

  const onSubmit = async (data: ItemFormData) => {
    try {
      const transformedData: ItemFormData = {
        ...data,
        name: data.name.toLowerCase(),
        type: data.type.toLowerCase(),
        flavor: data.flavor.toLowerCase(),
      };

      await addItem(transformedData);
      await refetch();
      reset();
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openAddModal) {
        setOpenAddModal(false);
      }
    };
    if (openAddModal) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openAddModal, setOpenAddModal]);

  if (!openAddModal) return null;

  return (
    <div className="bg-black/60 absolute left-0 top-0 w-full h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-zinc-800 rounded-lg shadow-md border-b border-blue-400/50 w-[30%] max-w-[450px] max-h-[550px] p-4 flex flex-col gap-4 items-center"
      >
        <span
          onClick={() => setOpenAddModal(false)}
          className="absolute right-4 ease-in-out duration-200 cursor-pointer hover:bg-zinc-600 rounded-md p-1"
        >
          <XIcon />
        </span>

        <h1 className="text-xl text-zinc-200/70">{name}</h1>
        <h3 className="text-xs">
          {name} - R${" "}
          {value ? value.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00"}
        </h3>

        <div className="w-full">
          <Input placeholder="Nome do Item" {...register("name")} />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <Input
              placeholder="Tipo do Item. Ex: Sorvete, Bebida, Comida..."
              {...register("type")}
            />
            {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
          </div>
          <div className="flex-1">
            <Input
              placeholder="Quantidade. Ex: 30, 40, 50"
              type="number"
              {...register("qtd", { valueAsNumber: true })}
            />
            {errors.qtd && <p className="text-red-500 text-xs">{errors.qtd.message}</p>}
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <Input
              placeholder="Sabor. Ex: Morango, Chocolate, Coco..."
              {...register("flavor")}
            />
            {errors.flavor && <p className="text-red-500 text-xs">{errors.flavor.message}</p>}
          </div>
          <div className="flex-1">
            <Input
              placeholder="Valor R$ 20,00"
              type="number"
              step="0.01"
              {...register("value", { valueAsNumber: true })}
            />
            {errors.value && <p className="text-red-500 text-xs">{errors.value.message}</p>}
          </div>
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}
        {success && <p className="text-green-500 text-xs">Item adicionado com sucesso!</p>}

        <GeneralButton disabled={loading} type="submit" className="w-full relative">
          {loading ? <Spinner className="absolute" /> : "Adicionar"}
        </GeneralButton>
      </form>
    </div>
  );
};