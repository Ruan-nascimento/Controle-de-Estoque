import { useEffect, useState } from "react"
import { Spinner } from "../spinner"
import { items } from "../historicTable/table"
import { API_URL } from "@/lib/utils"

export const AllSellToday = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<items[]>([])

    useEffect(() => {
            const fetchSales = async () => {
              try {
                setLoading(true)
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
              } finally {
                setLoading(false)
              }
            };
        
            fetchSales();
          }, []);
    
    const today = data.filter(d => new Date(d.createdAt).getDate() === new Date().getDate())
    .length

    return(
        <div
        className="bg-zinc-800 p-4 rounded-md h-[50%] min-w-[200px] flex flex-col shadow-xl relative border-b border-cyan-600"
        >

            <span
            className="text-lg font-semibold"
            >Vendas Hoje</span>

            <span
            className="text-3xl font-semibold"
            >{loading ? '...' : today}</span>

            {loading && <Spinner className="absolute right-12 top-1/2"/>}
    </div>
    )
}