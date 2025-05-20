import { API_URL } from "@/lib/utils";
import { useEffect, useState } from "react";
import { items } from "../historicTable/table";

export const CurrentMonthVsPastMonth = () => {

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

    const month = (date:number) => {
        const months: {[key:number]: string} = {1:'Janeiro', 2:'Fervereiro', 3:'Março', 4:'Abril', 5:'Maio', 6:'Junho', 7:'Julho', 8:'Agosto', 9:'Setembro', 10:'Outubro', 11:'Novembro', 12:'Dezembro'}

        return months[date + 1]

    }

    const pastMonth = new Date().getMonth() - 1

    const amountPastMonth = data.filter(d => new Date(d.createdAt).getMonth() === pastMonth).reduce((acc, item) => acc + (item.total || 0), 0)
    const amountCurrentMonth = data.filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth()).reduce((acc, item) => acc + (item.total || 0), 0)

    const sub = amountCurrentMonth - amountPastMonth

    const percent = () => {

        if (amountPastMonth === 0){
            const percent = amountCurrentMonth.toFixed(1)
            return percent
        } else if (amountCurrentMonth === 0) {
            const percent = amountPastMonth.toFixed(1)
            return percent
        } else if (sub > 0) {
            const percent = (amountCurrentMonth * 100 / amountPastMonth).toFixed(1)
            return percent
        } else if (sub < 0) {
            const percent = (100 - (amountCurrentMonth * 100 / amountPastMonth)).toFixed(1)
            return percent
        }

    }
    


    return(
        <div
        className="flex flex-col pt-4 items-center justify-around min-w-[200px] w-[25%] h-64 rounded-lg border-b border-cyan-600 shadow-xl bg-zinc-800"
        >   
            <h3 className="text-md">Lucro de {month(new Date().getMonth())} relacionado à {month(new Date().getMonth()-1)} </h3>

            <div className="flex items-center justify-around w-full h-full">

                <span
                className={`${sub > 0 ? 'bg-green-500/60' : 'bg-red-500/60'} w-44 h-44 rounded-full flex items-center justify-center text-2xl font-bold`}
                >{sub > 0 ? '+' : '-'}{percent()}%</span>

                <div className="flex flex-col gap-4">

                    <div className="flex flex-col bg-zinc-700 p-1 px-2 rounded-xl items-center justify-center">
                        <span className="text-xs">{month(new Date().getMonth())}</span>
                        <span>R$ {amountCurrentMonth.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <div className="flex flex-col bg-zinc-600 p-1 px-2 rounded-xl items-center justify-center">
                        <span className="text-xs">{month(pastMonth)}</span>
                        <span>R$ {amountPastMonth.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

            </div>

        </div>
    )
}