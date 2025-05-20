import { LayoutGridIcon } from "lucide-react"
import { useItems } from "@/lib/hooks/useItems"
import { DailyTarget } from "../../dashboardWidgets/dailyTarget"
import { DashboardProvider } from "@/lib/contexts/dashboardContext"
import { TotalSellToday } from "../../dashboardWidgets/totalSellToday"

export const DashboardPage = () => {

    const  {items} = useItems()

    return(
        <DashboardProvider>
        <section
        className="w-full h-full flex flex-col gap-6"
        >
            <header className="flex items-center gap-10">
                <h1 className="flex items-center gap-4 text-xl font-semibold"><LayoutGridIcon size={44}/> Painel Principal</h1>
            </header>

            <main className="flex flex-col max-h-full overflow-auto custom-scrollbar gap-4">

                <div className="w-full flex gap-4">
                    <DailyTarget/>
                    <TotalSellToday/>
                </div>

            </main>
        </section>
        </DashboardProvider>
    )
}