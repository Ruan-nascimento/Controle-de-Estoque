import { Button } from "@/components/ui/button"
import { PlusCircleIcon, ShoppingCartIcon } from "lucide-react"

interface AddItemToCartProps {
    item: string
    flavor: string
    value: number
    cart: (val:boolean) => void
    qtd: number
}

export const AddItemToCart = ({item, qtd, flavor, value, cart}: AddItemToCartProps) => {

    const handleAddToCar = () => {
        cart(true)
    }

    return(
        <div
            className="w-52 p-3 bg-zinc-800/40 border-b border-cyan-400 backdrop-blur-lg max-h-40 rounded-lg flex flex-col justify-between gap-2 shadow-md"
            >

                <div className="flex flex-col relative">
                    <span
                    className="text-lg font-bold max-h-10"
                    >{item.split(' ')[0].toUpperCase()}</span>
                    <span className="text-md">{flavor.charAt(0).toUpperCase() + flavor.slice(1).toLowerCase()}</span>
                    <span className="text-cyan-400/70 font-bold text-lg">R$ {value.toFixed(2)}</span>
                    <span className="absolute right-0 text-xs font-bold text-cyan-400 p-2 rounded-lg bg-zinc-700/70">{qtd}</span>
                </div>
                
                <div className="flex gap-2">
                    <Button
                    onClick={handleAddToCar}
                    className=" w-full bg-cyan-600 duration-200 ease-in-out hover:bg-cyan-700/70 cursor-pointer active:bg-cyan-600"
                    >
                        Carrinho <ShoppingCartIcon/>
                    </Button>

                </div>
            </div>
    )
}