"use client";

import { CheckCheckIcon, ShoppingCartIcon, XIcon, Trash2Icon } from "lucide-react";
import { AddItemToCart } from "../../boxAddItemToCart";
import { useItems } from "@/app/controllers/useItems";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "../../spinner";
import { CartItemMod } from "../../cartItem";
import { useCartContext } from "@/lib/contexts/cartContext";
import { Button } from "@/components/ui/button";

export const SellPage = () => {
  const { items, loading: itemsLoading, refetchItems } = useItems();
  const { cartItems, addToCart, refetch, error, clearCart, confirmSale } = useCartContext();
  const [openAside, setOpenAside] = useState<boolean>(false);
  const [findItem, setFindItem] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [sellComplete, setSellComplete] = useState<boolean>(false);
  const [sellValue, setSellValue] = useState<number>(0)

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = cartItems.reduce(
    (sum, item) => sum + item.value * item.quantity,
    0
  );

  const itemsFounded = items.filter(
    (item) =>
      item.name.toLowerCase().includes(findItem?.toLowerCase()) ||
      item.flavor.toLowerCase().includes(findItem?.toLowerCase()) ||
      item.status.toLowerCase().includes(findItem?.toLowerCase())
  );

  const handleAddToCart = async (item: any) => {
    try {
      const itemToAdd = {
        id: item.id,
        name: item.name,
        flavor: item.flavor,
        value: item.value,
        quantity: 1,
        status: item.status,
        qtd: item.qtd,
        type: item.type,
        createdAt: item.createdAt,
      };
      await addToCart(itemToAdd);
      await refetch();
      setOpenAside(true);
      setErrorMessage(null);
      setSuccessMessage(null);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao adicionar item ao carrinho"
      );
      setSuccessMessage(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      await refetch();
      setErrorMessage(null);
      setSuccessMessage("Carrinho esvaziado com sucesso!");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao esvaziar o carrinho"
      );
      setSuccessMessage(null);
    }
  };

  const handleConfirmSale = async () => {
    try {
      setSellValue(totalValue)
      setIsConfirming(true);
      await confirmSale();
      await refetch();
      await refetchItems();
      setSuccessMessage("Venda confirmada com sucesso!");
      setErrorMessage(null);
      setSellComplete(true)
      setInterval(() => {
        setSellComplete(false)
      }, 3000)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao confirmar a venda"
      );
      setSuccessMessage(null);
    } finally {
      setIsConfirming(false);
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, errorMessage, successMessage]);

  useEffect(() => {
    if (cartItems.length === 0 && openAside) {
      setOpenAside(false);
    }
  }, [cartItems, openAside]);

  return (
    <section className="w-full h-full flex gap-4 relative">

      {sellComplete && (
        <div className="right-1/2 flex items-center flex-col justify-center text-green-900 font-medium translate-x-1/2 bottom-20 absolute min-w-56 h-20 rounded-md bg-green-100/90 backdrop-blur-2xl z-10">
        <span>Venda de <b className="text-green-600">R${sellValue.toFixed(2).replace('.', ',')}</b></span>
        <span>feita com sucesso</span>
      </div>
      )}

      <div className="w-full h-full flex flex-col gap-4">
        <header className="flex justify-between">
          <Input
            className="w-[30%] bg-zinc-800"
            placeholder="Pesquisar..."
            onChange={(e) => setFindItem(e.target.value)}
            value={findItem ? findItem : ""}
          />

          {cartItems.length > 0 && (
            <Button
              onClick={() => setOpenAside(true)}
              disabled={openAside}
              className="bg-cyan-600 relative cursor-pointer duration-200 ease-in-out hover:bg-cyan-600/80 disabled:bg-cyan-600/50"
            >
              <span className="absolute -left-2 -top-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {totalItems}
              </span>
              <ShoppingCartIcon />
            </Button>
          )}
        </header>

        <main
          className={`w-full grid gap-2 justify-baseline items-start overflow-auto custom-scrollbar ${
            openAside ? "grid-cols-4" : "grid-cols-5"
          }`}
        >
          {itemsLoading ? (
            <Spinner className="absolute top-1/2 left-1/2" />
          ) : itemsFounded.length > 0 ? (
            itemsFounded.map((item) =>
              item.qtd > 0 ? (
                <AddItemToCart
                  qtd={item.qtd}
                  key={item.id}
                  flavor={item.flavor}
                  item={item.name}
                  value={item.value}
                  cart={() => handleAddToCart(item)}
                />
              ) : null
            )
          ) : (
            items.map((item) => (
              <AddItemToCart
                qtd={item.qtd}
                key={item.id}
                flavor={item.flavor}
                item={item.name}
                value={item.value}
                cart={() => handleAddToCart(item)}
              />
            ))
          )}
        </main>
      </div>
      {openAside && (
        <aside className="relative min-w-[230px] bg-zinc-800 rounded-lg px-4 pt-10 flex flex-col gap-4 pb-4">
          <span
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => setOpenAside(false)}
          >
            <XIcon />
          </span>

          <div className="flex justify-between items-center">
            <span className="text-xl flex gap-3 items-center font-bold">
              Carrinho <ShoppingCartIcon className="text-cyan-400" />
            </span>
            {cartItems.length > 0 && (
              <Button
                onClick={handleClearCart}
                className="bg-zinc-600/70 h-6 hover:bg-zinc-600/50 active:bg-zinc-600 p-2"
              >
                Limpar
              </Button>
            )}
          </div>

          <div className="w-full h-full overflow-auto invisible-scroll">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItemMod item={item} key={item.id} />
              ))
            ) : (
              <p className="text-gray-400">Carrinho vazio</p>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-zinc-700/80 pt-4">
            <span className="text-xs flex justify-between items-baseline">
              Total{" "}
              <b className="text-xl font-bold text-green-600">
                R$ {totalValue.toFixed(2).split(".").join(",")}
              </b>
            </span>
            <Button
              onClick={handleConfirmSale}
              disabled={isConfirming}
              className="w-full rounded-lg bg-cyan-600 flex items-center gap-4 duration-200 hover:bg-cyan-600/80 active:bg-cyan-600/50 cursor-pointer"
            >
              {isConfirming ? (
                <Spinner className="w-6 h-6" />
              ) : (
                <span className="flex items-center gap-4">
                  Confirmar
                  <CheckCheckIcon />
                </span>
              )}
            </Button>
          </div>
        </aside>
      )}
    </section>
  );
};