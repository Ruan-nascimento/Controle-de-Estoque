import { Button } from "@/components/ui/button"
import { Calendar1Icon, CoinsIcon, LayoutGridIcon } from "lucide-react"
import { useItems } from "@/lib/hooks/useItems"

export const DashboardPage = () => {

    const  {items} = useItems()

    return(
        <section
        className="w-full h-full flex flex-col gap-6"
        >
            <header className="flex items-center gap-10">
                <h1 className="flex items-center gap-4 text-xl font-semibold"><LayoutGridIcon size={44}/> Painel Principal</h1>
            </header>

            <main className="max-h-full overflow-auto custom-scrollbar flex gap-4">

            </main>
        </section>
    )
}