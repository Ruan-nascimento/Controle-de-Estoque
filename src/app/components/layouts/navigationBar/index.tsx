import { useState } from "react"
import { ButtonNavigateBar } from "../../ButtonNavigationBar"

export type NavProps = "dashboard" | "sell" | "stock" | string

export const NavigationBar = ({currentPage, setCurrentPage}: {currentPage:string, setCurrentPage: (val:string) => void}) => {

    return (
        <nav className="w-[25%] max-w-[250px] h-full bg-zinc-800 py-6">

            {
                ["dashboard", "stock", "sell"].map((page) => {
                    return(
                        <ButtonNavigateBar 
                        key={page}
                        typed={page} 
                        current_page={currentPage}
                        onClick={() => setCurrentPage(page)}
                        className="text-lg font-semibold"
                        >
                            {
                                page === 'dashboard' ? 'Painel' : 
                                page === 'stock' ? 'Estoque' :
                                page === 'sell' ? 'Vendas': ''
                            }
                        </ButtonNavigateBar>
                    )
                })
            }

        </nav>
    )
}