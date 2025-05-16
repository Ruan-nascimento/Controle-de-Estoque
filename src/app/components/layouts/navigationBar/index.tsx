import { ButtonNavigateBar } from "../../ButtonNavigationBar"
import { BoxesIcon, Clock10Icon, Coins, LayoutDashboard } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { API_URL } from "@/lib/utils"
import { useRouter } from "next/navigation"

export type NavProps = "dashboard" | "sell" | "stock" | "historic" | string

export const NavigationBar = ({currentPage, setCurrentPage, tokenType}: {currentPage:string, setCurrentPage: (val:string) => void, tokenType:'auth_token' | 'user_token' | null}) => {

    const route = useRouter()

    const removeCookies = async () => {
        const response = await fetch(`${API_URL}/api/login/clear-cookies`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if(response.ok) {
            route.push(`${API_URL}/Auth/Login`)
        }
    }

    return (
        <nav className="flex flex-col justify-between w-[25%] max-w-[250px] h-full bg-zinc-950/20 bor py-6 px-4 backdrop-blur-lg border-r border-cyan-400">

            <div className="flex flex-col">
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

            <div className="flex flex-col items-start justify-baseline gap-2">

            {
                
                ["dashboard", "sell", "stock", "historic"].map((page) => {
                    return(
                        <ButtonNavigateBar 
                        key={page}
                        typed={page} 
                        current_page={currentPage}
                        onClick={() => setCurrentPage(page)}
                        className="text-lg font-semibold"
                        >
                            {
                                tokenType === 'auth_token' ? (
                                    page === 'dashboard' ? <span className="flex items-center gap-4"><LayoutDashboard className="text-cyan-400"/> Painel</span> : 
                                    page === 'sell' ? <span className="flex items-center gap-4"><Coins className="text-cyan-400"/> Vendas</span> :
                                    page === 'stock' ? <span className="flex items-center gap-4"><BoxesIcon className="text-cyan-400"/> Estoque</span> : 
                                    page === 'historic' ? <span className="flex items-center gap-4"><Clock10Icon className="text-cyan-400"/> Histórico</span> : ''
                                ) :
                                (
                                   page === 'sell' ? <span className="flex items-center gap-4"><Coins className="text-cyan-400"/> Vendas</span> : 
                                   page === 'historic' ? <span className="flex items-center gap-4"><Clock10Icon className="text-cyan-400"/> Histórico</span> : ''
                                )
                            }
                        </ButtonNavigateBar>
                    )
                })
                
            }

            </div>
            </div>

            <Button 
            onClick={removeCookies}
            className="w-full px-2 rounded-md bg-cyan-600 duration-200 ease-in-out cursor-pointer hover:bg-cyan-600/80 active:bg-cyan-600/40">
                Trocar de Usuário
            </Button>

        </nav>
    )
}