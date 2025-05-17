import { Clock2Icon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HistoricTableComponent } from "./table"
import { useState } from "react"

interface HistoricTableProps {
    setDateFilterModal: (val: boolean) => void
    dateFilter: boolean
}

export const HistoricTable = ({setDateFilterModal, dateFilter}:HistoricTableProps) => {

    const [search, setSearch] = useState<string>('')

    return (
        <main className="w-full h-full rounded-md relative">

            <h1
            className="flex items-center gap-4 text-3xl font-semibold mb-8"
            ><Clock2Icon className="text-cyan-600" size={32}/> Histórico de Vendas</h1>

            <header
            className="flex items-center justify-end pr-8 gap-4 h-20 w-full bg-zinc-800 rounded-t-md border-b border-cyan-800/80"
            >
                
                <Button
                onClick={() => setDateFilterModal(true)}
                className={`p-3 bg-transparent border duration-200 ease-in-out hover:bg-cyan-700/80 cursor-pointer ${dateFilter && 'bg-cyan-600'}`}
                >Filtrar Por Data</Button>

                <div className="max-w-[40%] w-full relative h-10">
                    <Input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="outline-none w-full pr-12" placeholder="Pesquise por item, valor, etc..."/>
                    <SearchIcon size={16} className="absolute right-4 top-1/2 -translate-y-1/2"/>
                </div>

            </header>

            <HistoricTableComponent founded={search}/>
        </main>
    )
}