import { LayoutGridIcon } from "lucide-react"
import { useItems } from "@/lib/hooks/useItems"
import { DailyTarget } from "../../dashboardWidgets/dailyTarget"
import { DashboardProvider } from "@/lib/contexts/dashboardContext"
import { TotalSellToday } from "../../dashboardWidgets/totalSellToday"
import { SellPerTransaction } from "../../dashboardWidgets/sellPerTransaction"
import { AllSellToday } from "../../dashboardWidgets/AllSell"
import { ItemsStock } from "../../dashboardWidgets/itemsStock"
import { CurrentMonthVsPastMonth } from "../../dashboardWidgets/currentMonthVsPastMonth"
import { LastSevenDays } from "../../dashboardWidgets/lastSevenDays"

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

            <main className="flex flex-col h-full overflow-auto custom-scrollbar gap-4">

                <div className="w-full flex gap-4">
                    <DailyTarget/>

                    <div className="flex flex-col gap-2">
                        <TotalSellToday/>
                        <SellPerTransaction/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <AllSellToday/>
                        <ItemsStock/>
                    </div>

                    <CurrentMonthVsPastMonth/>
                    
                </div>

                <div className="flex gap-4 w-full bg-zinc-800 shadow-md h-full rounded-md p-2">
                    <LastSevenDays/>
                </div>

            </main>
        </section>
        </DashboardProvider>
    )
}