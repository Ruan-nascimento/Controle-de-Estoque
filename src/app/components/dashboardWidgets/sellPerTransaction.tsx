import { API_URL } from "@/lib/utils";
import { useEffect, useState } from "react"
import { items } from "../historicTable/table";
import { Spinner } from "../spinner";

export const SellPerTransaction = () => {

    const [data, setData] = useState<items[]>([])
    const [loading, setLoading] = useState<boolean>(false)

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
    
    const sell = data.filter(d => new Date(d.createdAt).getDay() === new Date().getDay()).length
    const amount = data.filter(d => new Date(d.createdAt).getDay() === new Date().getDay()).reduce((acc, item) => acc + (item.total || 0), 0)
    const avarage = !sell && !amount ? (0).toFixed(2).replace('.', ',') : (amount / sell).toFixed(2).replace('.', ',')

    return(
        <div
         className="bg-zinc-800 p-4 rounded-md h-[50%] min-w-[300px] flex flex-col shadow-xl relative border-b border-cyan-600"
        >

            <span
            className="text-lg font-semibold"
            >Ticket Médio Hoje</span>

            <span
            className="text-3xl font-semibold"
            >R$ {loading ? '...' : avarage}</span>

            {loading && <Spinner className="absolute right-12 top-1/2"/>}
        </div>
    )
}