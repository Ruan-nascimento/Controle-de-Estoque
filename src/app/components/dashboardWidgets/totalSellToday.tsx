import { API_URL } from "@/lib/utils";
import { useEffect, useState } from "react"
import { items } from "../historicTable/table";

export const TotalSellToday = () => {

    const [data, setData] = useState<items[]>([])

    useEffect(() => {
        const fetchSales = async () => {
          try {
            const response = await fetch(`${API_URL}/api/historic`, {
              method: "GET",
              credentials: "include",
            });
    
            if (response.ok) {
              const salesData = await response.json();
              setData(salesData);
            } else {
              console.error("Erro ao buscar dados:", response.status);
            }
          } catch (error) {
            console.error("Erro na requisição:", error);
          }
        };
    
        fetchSales();
      }, []);

    const earnToday = data
    .filter((d) => new Date(d.createdAt).getDate() === new Date().getDate())
    .reduce((acc, item) => acc + (item.total || 0), 0);

    const earnYesterday = data
    .filter(y => new Date(y.createdAt).getDate() === new Date().getDate() -1)
    .reduce((acc, item) => acc + (item.total || 0), 0);

    const percentTodayVsYesterday = earnYesterday ? earnToday * 100 / earnYesterday : 0;

    const percent = (100 - percentTodayVsYesterday).toFixed(1)

    return(
        <div
         className="bg-zinc-800 p-4 rounded-md h-[50%] min-w-[300px] flex flex-col shadow-xl relative"
        >
            <span 
            title={`Vendeu ${percent.replace('-', '')}% a ${percent.includes('-') ? 'mais' : 'menos'} que ontem - R$${earnYesterday.toFixed(2).replace('.', ',')}`}

            className={`absolute top-1/2 right-6 ${earnToday > earnYesterday ? 'text-green-500' : earnToday < earnYesterday ? 'text-red-500' : 'text-zinc-400'}`}>{earnToday > earnYesterday ? '+' : earnToday < earnYesterday ? '-' : ''}{percent.includes('-') ? `${percent.replace('-', '')}%` : `${percent}%`}</span>

            <span
            className="text-lg font-semibold"
            >Total de Vendas Hoje</span>

            <span
            className="text-3xl font-semibold"
            >R$ {earnToday.toFixed(2).replace('.', ',')}</span>
        </div>
    )
}