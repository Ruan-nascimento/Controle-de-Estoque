import { useState } from "react"
import { ButtonNavigateBar } from "../../ButtonNavigationBar"
import { BoxesIcon, Clock10Icon, Coins, LayoutDashboard } from "lucide-react"
import Image from "next/image"

export type NavProps = "dashboard" | "sell" | "stock" | "historic" | string

export const NavigationBar = ({currentPage, setCurrentPage}: {currentPage:string, setCurrentPage: (val:string) => void}) => {

    return (
        <nav className="w-[25%] max-w-[250px] h-full bg-zinc-950/20 bor py-6 px-4 backdrop-blur-lg border-r border-cyan-400">

            <div
            className="flex items-center gap-6 mb-10 border-b border-zinc-200/40 pb-6"
            >
                <Image
                alt="Logo img"
                src={'/img/logo.jpg'}
                width={200}
                height={200}
                className="w-16 h-16 rounded-full object-cover border-2 border-zinc-50"
                /> 
                <span className="uppercase font-black text-2xl">stock</span>
            </div>

            {
                ["dashboard", "stock", "sell", "historic"].map((page) => {
                    return(
                        <ButtonNavigateBar 
                        key={page}
                        typed={page} 
                        current_page={currentPage}
                        onClick={() => setCurrentPage(page)}
                        className="text-lg font-semibold"
                        >
                            {
                                page === 'dashboard' ? <span className="flex items-center gap-4"><LayoutDashboard className="text-cyan-400"/> Painel</span> : 
                                page === 'stock' ? <span className="flex items-center gap-4"><BoxesIcon className="text-cyan-400"/> Estoque</span> :
                                page === 'sell' ? <span className="flex items-center gap-4"><Coins className="text-cyan-400"/> Vendas</span>: 
                                page === 'historic' ? <span className="flex items-center gap-4"><Clock10Icon className="text-cyan-400"/> Histórico</span> : ''
                            }
                        </ButtonNavigateBar>
                    )
                })
            }

        </nav>
    )
}