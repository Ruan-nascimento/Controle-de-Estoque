import { useState, useEffect, useRef, useCallback } from "react";
import { BoxIcon, Filter, Plus, Trash } from "lucide-react";
import { ItemsTable } from "../../ItemsTable";
import { ColumnFiltersState } from "@tanstack/react-table";
import { FilterModal } from "../../Modals/FilterModal";
import { Button } from "@/components/ui/button";
import { Item } from "@/app/controllers/getAllItems";
import { EditItemModal } from "../../Modals/EditItemModal";
import { toast } from "sonner";
import { GeneralButton } from "../../ButtonGeneral";
import { useItems } from "@/app/controllers/useItems";
import { useDeleteItems } from "@/app/controllers/useDeleteItems";
import {debounce} from 'lodash'

interface StockProps {
  setOpenEditModal: (val: boolean) => void;
}

export const StockPage = ({ setOpenEditModal: setOpenEditModalParent }: StockProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { items, loading, error, refetch } = useItems(); 
  const { deleteItems, loading: deleteLoading, error: deleteError } = useDeleteItems();

  const filterButtonRef = useRef<HTMLDivElement>(null);
  const filterModalRef = useRef<HTMLDivElement>(null);

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(event.target as Node) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setIsFilterModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenEditModal = (val: boolean, item?: Item) => {
    setOpenEditModal(val);
    setSelectedItem(item || null);
    setOpenEditModalParent(val);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await deleteItems(selectedIds);
      toast.success("Itens deletados com sucesso!");
      setSelectedIds([]);
      await refetch(); // Refetch para atualizar os dados
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro desconhecido");
    }
  };

  return (
    <section className="relative flex flex-col h-full gap-6 justify-between">
      <div className="h-full">
        <header className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <BoxIcon size={44} />
            <span className="text-xl font-semibold">Itens Cadastrados</span>
          </div>

          <div className="flex gap-4 justify-between">
            <div className="flex gap-2 items-center">
              <GeneralButton type="button" disabled={false}>
                <Plus /> Adicionar
              </GeneralButton>
              <div className="relative" ref={filterButtonRef}>
                <GeneralButton
                  disabled={false}
                  type="button"
                  onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
                >
                  <Filter /> Filtro
                </GeneralButton>
                {isFilterModalOpen && (
                  <div ref={filterModalRef} className="absolute top-12 left-0 z-50">
                    <FilterModal
                      onClose={() => setIsFilterModalOpen(false)}
                      onApplyFilters={(filters) => setColumnFilters(filters)}
                    />
                  </div>
                )}
              </div>
              <input
                placeholder="Pesquisar..."
                onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                className="h-full bg-zinc-700/50 rounded-md border border-zinc-500/60 outline-0 text-zinc-200 px-2 duration-200 ease-in-out hover:bg-zinc-700/80 focus:border-zinc-200"
              />
              {selectedIds.length > 0 && (
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 cursor-pointer text-zinc-200 duration-200 ease-in hover:bg-red-600/70"
                  disabled={deleteLoading}
                >
                  <Trash />
                  <span>{deleteLoading ? "Deletando..." : `Apagar (${selectedIds.length})`}</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        <ItemsTable
          onSelectionChange={(ids) => setSelectedIds(ids)}
          columnFilters={columnFilters}
          setOpenEditModal={handleOpenEditModal}
          searchTerm={searchTerm}
          items={items}
          loading={loading}
          error={error}
          refetch={refetch}
        />
      </div>

      <footer className="bg-zinc-900 h-16 flex items-center justify-center text-gray-700">
        Controler
      </footer>

      {openEditModal && (
        <EditItemModal
          setOpenEditModal={setOpenEditModal}
          selectedItem={selectedItem}
          onUpdate={refetch}
        />
      )}
    </section>
  );
};