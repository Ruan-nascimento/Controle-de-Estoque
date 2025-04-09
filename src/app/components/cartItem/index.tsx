import { useCartContext } from "@/lib/contexts/cartContext";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  flavor: string;
  value: number;
  quantity: number;
  [key: string]: any;
}

interface CartItemProps {
  item: CartItem;
}

export const CartItemMod = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart, refetch } = useCartContext();

  const handleIncreaseQuantity = async () => {
    const newQuantity = item.quantity + 1;
    await updateQuantity(item.id, newQuantity);
    await refetch(); // Atualiza os dados após a mudança
  };

  const handleDecreaseQuantity = async () => {
    if (item.quantity === 1) {
      await removeFromCart(item.id);
      await refetch(); // Atualiza os dados após a remoção
    } else {
      const newQuantity = item.quantity - 1;
      await updateQuantity(item.id, newQuantity);
      await refetch(); // Atualiza os dados após a mudança
    }
  };

  const totalValue = item.value * item.quantity;

  return (
    <div className="w-full border-b border-zinc-700 flex flex-col">
      <span className="text-md font-bold">{item.name.toUpperCase()}</span>

      <span className="text-xs">
        {item.flavor?.charAt(0).toUpperCase() + item.flavor?.slice(1).toLowerCase()}
      </span>

      <div className="flex justify-between items-center mt-2 mb-2">
        <div className="flex gap-2 items-center">
          <button onClick={handleDecreaseQuantity}>
            <MinusCircleIcon />
          </button>
          <span>{item.quantity}</span>
          <button onClick={handleIncreaseQuantity}>
            <PlusCircleIcon />
          </button>
        </div>

        <span className="text-cyan-400 font-semibold">
          R$ {totalValue.toFixed(2).split(".").join(",")}
        </span>
      </div>
    </div>
  );
};